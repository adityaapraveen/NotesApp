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
        ownerId: userId,
        deletedAt: null
    };

    const [notes, total] = await prisma.$transaction([
        prisma.note.findMany({
            where,
            select: noteResponseSelect,
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
        data: notes,
        pagination: buildPaginationMeta({
            page,
            limit,
            total
        })
    };
};

export const getOwnedNoteById = async ({ userId, noteId }) => {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            ownerId: userId,
            deletedAt: null
        },
        select: noteResponseSelect
    });

    if (!note) {
        throw new AppError("Note not found", 404);
    }

    return note;
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