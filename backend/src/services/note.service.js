import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

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

const formatNoteResponse = (note) => {
    return {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
    };
};

export const createNote = async ({ userId, title, content }) => {
    const note = await prisma.note.create({
        data: {
            title,
            content,
            ownerId: userId
        },
        select: noteResponseSelect
    });

    return note;
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
        data: notes.map((note) => ({
            id: note.id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            access: note.ownerId === userId ? "owner" : "shared",
            owner: {
                id: note.owner.id,
                email: note.owner.email
            }
        })),
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

    return {
        ...formatNoteResponse(note),
        access: note.ownerId === userId ? "owner" : "shared"
    };
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
        select: noteResponseSelect
    });

    return updatedNote;
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