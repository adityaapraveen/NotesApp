import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import {
    mapAccessibleNoteResponse,
    mapNoteResponse,
    mapNoteListItemResponse
} from "../utils/noteResponse.js";
import { safelyUpsertNoteEmbedding } from "./embedding.service.js";
import { safelyRebuildConnectionsForNote } from "./graph.service.js";

const noteResponseSelect = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true
};

const noteWithAccessSelect = {
    id: true,
    title: true,
    content: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true
};

export const createNote = async ({ userId, title, content }) => {
    const note = await prisma.note.create({
        data: {
            title,
            content,
            ownerId: userId
        },
        select: {
            ...noteResponseSelect,
            ownerId: true
        }
    });

    const embedding = await safelyUpsertNoteEmbedding({
        noteId: note.id,
        title: note.title,
        content: note.content
    });

    if (embedding) {
        await safelyRebuildConnectionsForNote({
            userId,
            noteId: note.id
        });
    }

    return mapNoteResponse(note);
};

export const getNotesForUser = async ({ userId, page, limit }) => {
    const { skip, take } = getPagination({ page, limit });

    const where = {
        deletedAt: null,
        OR: [
            {
                ownerId: userId
            },
            {
                shares: {
                    some: {
                        sharedWithUserId: userId
                    }
                }
            }
        ]
    };

    const [notes, total] = await prisma.$transaction([
        prisma.note.findMany({
            where,
            select: {
                ...noteWithAccessSelect,
                owner: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            },
            orderBy: {
                updatedAt: "desc"
            },
            skip,
            take
        }),

        prisma.note.count({
            where
        })
    ]);

    return {
        data: notes.map((note) => mapNoteListItemResponse(note, userId)),
        pagination: buildPaginationMeta({
            page,
            limit,
            total
        })
    };
};

export const getAccessibleNoteById = async ({ userId, noteId }) => {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            deletedAt: null,
            OR: [
                {
                    ownerId: userId
                },
                {
                    shares: {
                        some: {
                            sharedWithUserId: userId
                        }
                    }
                }
            ]
        },
        select: noteWithAccessSelect
    });

    if (!note) {
        throw new AppError("Note not found", 404);
    }

    return mapAccessibleNoteResponse(note, userId);
};

export const updateOwnedNote = async ({ userId, noteId, title, content }) => {
    const existingNote = await prisma.note.findFirst({
        where: {
            id: noteId,
            ownerId: userId,
            deletedAt: null
        },
        select: {
            id: true
        }
    });

    if (!existingNote) {
        throw new AppError("Note not found", 404);
    }

    const updatedNote = await prisma.note.update({
        where: {
            id: noteId
        },
        data: {
            title,
            content
        },
        select: {
            ...noteResponseSelect,
            ownerId: true
        }
    });

    const embedding = await safelyUpsertNoteEmbedding({
        noteId: updatedNote.id,
        title: updatedNote.title,
        content: updatedNote.content
    });

    if (embedding) {
        await safelyRebuildConnectionsForNote({
            userId,
            noteId: updatedNote.id
        });
    }

    return mapNoteResponse(updatedNote);
};

export const deleteOwnedNote = async ({ userId, noteId }) => {
    const existingNote = await prisma.note.findFirst({
        where: {
            id: noteId,
            ownerId: userId,
            deletedAt: null
        },
        select: {
            id: true
        }
    });

    if (!existingNote) {
        throw new AppError("Note not found", 404);
    }

    await prisma.note.update({
        where: {
            id: noteId
        },
        data: {
            deletedAt: new Date()
        }
    });
};

export const shareOwnedNote = async ({ ownerId, noteId, shareWithEmail }) => {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            ownerId,
            deletedAt: null
        },
        select: {
            id: true,
            ownerId: true,
            title: true
        }
    });

    if (!note) {
        throw new AppError("Note not found", 404);
    }

    const userToShareWith = await prisma.user.findUnique({
        where: {
            email: shareWithEmail
        },
        select: {
            id: true,
            email: true
        }
    });

    if (!userToShareWith) {
        throw new AppError("User to share with not found", 404);
    }

    if (userToShareWith.id === ownerId) {
        throw new AppError("You cannot share a note with yourself", 400);
    }

    const existingShare = await prisma.noteShare.findUnique({
        where: {
            noteId_sharedWithUserId: {
                noteId,
                sharedWithUserId: userToShareWith.id
            }
        }
    });

    if (existingShare) {
        throw new AppError("Note is already shared with this user", 409);
    }

    await prisma.noteShare.create({
        data: {
            noteId,
            sharedWithUserId: userToShareWith.id
        }
    });

    return {
        message: "Note shared successfully",
        note: {
            id: note.id,
            title: note.title
        },
        shared_with: {
            id: userToShareWith.id,
            email: userToShareWith.email
        }
    };
};
