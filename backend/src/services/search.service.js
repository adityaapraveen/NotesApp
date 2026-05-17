import { prisma } from "../config/prisma.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

export const searchAccessibleNotes = async ({ userId, query, page, limit }) => {
    const { skip, take } = getPagination({ page, limit });

    const where = {
        deletedAt: null,

        AND: [
            {
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
            {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        ]
    };

    const [notes, total] = await prisma.$transaction([
        prisma.note.findMany({
            where,
            select: {
                id: true,
                title: true,
                content: true,
                ownerId: true,
                createdAt: true,
                updatedAt: true,
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