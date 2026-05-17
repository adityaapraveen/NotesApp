import { config } from "../config/config.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { cosineSimilarity } from "../utils/vector.js";

const getConnectionReason = ({ sourceTitle, targetTitle, strength }) => {
    const percentage = Math.round(strength * 100);

    return `These notes are semantically related based on their embeddings. "${sourceTitle}" and "${targetTitle}" have ${percentage}% similarity.`;
};

const normalizeConnectionPair = ({ noteIdA, noteIdB }) => {
    return [noteIdA, noteIdB].sort();
};

const getAccessibleNoteIdsFilter = (userId) => {
    return {
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
};

export const rebuildConnectionsForNote = async ({ userId, noteId }) => {
    const sourceNote = await prisma.note.findFirst({
        where: {
            id: noteId,
            ownerId: userId,
            deletedAt: null
        },
        select: {
            id: true,
            title: true,
            content: true,
            embedding: {
                select: {
                    vector: true,
                    dimension: true
                }
            }
        }
    });

    if (!sourceNote) {
        throw new AppError("Note not found", 404);
    }

    if (!sourceNote.embedding?.vector) {
        throw new AppError(
            "This note does not have an embedding yet. Update the note or create it again after configuring Hugging Face.",
            400
        );
    }

    const candidateNotes = await prisma.note.findMany({
        where: {
            ownerId: userId,
            deletedAt: null,
            id: {
                not: noteId
            },
            embedding: {
                isNot: null
            }
        },
        select: {
            id: true,
            title: true,
            embedding: {
                select: {
                    vector: true,
                    dimension: true
                }
            }
        }
    });

    const scoredConnections = candidateNotes
        .map((candidateNote) => {
            const strength = cosineSimilarity(
                sourceNote.embedding.vector,
                candidateNote.embedding.vector
            );

            return {
                note: candidateNote,
                strength
            };
        })
        .filter((item) => item.strength >= config.MEMORY_GRAPH_SIMILARITY_THRESHOLD)
        .sort((a, b) => b.strength - a.strength)
        .slice(0, config.MEMORY_GRAPH_MAX_CONNECTIONS);

    await prisma.$transaction(async (tx) => {
        await tx.noteConnection.deleteMany({
            where: {
                OR: [
                    {
                        sourceNoteId: noteId
                    },
                    {
                        targetNoteId: noteId
                    }
                ]
            }
        });

        for (const item of scoredConnections) {
            const [sourceNoteId, targetNoteId] = normalizeConnectionPair({
                noteIdA: noteId,
                noteIdB: item.note.id
            });

            await tx.noteConnection.upsert({
                where: {
                    sourceNoteId_targetNoteId: {
                        sourceNoteId,
                        targetNoteId
                    }
                },
                create: {
                    sourceNoteId,
                    targetNoteId,
                    strength: item.strength,
                    reason: getConnectionReason({
                        sourceTitle: sourceNote.title,
                        targetTitle: item.note.title,
                        strength: item.strength
                    })
                },
                update: {
                    strength: item.strength,
                    reason: getConnectionReason({
                        sourceTitle: sourceNote.title,
                        targetTitle: item.note.title,
                        strength: item.strength
                    })
                }
            });
        }
    });

    return {
        message: "Memory graph rebuilt successfully",
        note_id: noteId,
        connections_created: scoredConnections.length,
        connections: scoredConnections.map((item) => ({
            note_id: item.note.id,
            title: item.note.title,
            strength: Number(item.strength.toFixed(4)),
            reason: getConnectionReason({
                sourceTitle: sourceNote.title,
                targetTitle: item.note.title,
                strength: item.strength
            })
        }))
    };
};

export const safelyRebuildConnectionsForNote = async ({ userId, noteId }) => {
    try {
        return await rebuildConnectionsForNote({
            userId,
            noteId
        });
    } catch (error) {
        console.error("Failed to rebuild memory graph connections");
        console.error(error);
        return null;
    }
};

export const getMemoryGraphForUser = async ({ userId, minStrength }) => {
    const accessibleNotes = await prisma.note.findMany({
        where: getAccessibleNoteIdsFilter(userId),
        select: {
            id: true,
            title: true,
            content: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true
        }
    });

    const accessibleNoteIds = accessibleNotes.map((note) => note.id);

    if (accessibleNoteIds.length === 0) {
        return {
            nodes: [],
            edges: []
        };
    }

    const connections = await prisma.noteConnection.findMany({
        where: {
            strength: {
                gte: minStrength
            },
            sourceNoteId: {
                in: accessibleNoteIds
            },
            targetNoteId: {
                in: accessibleNoteIds
            },
            sourceNote: {
                deletedAt: null
            },
            targetNote: {
                deletedAt: null
            }
        },
        select: {
            id: true,
            sourceNoteId: true,
            targetNoteId: true,
            strength: true,
            reason: true
        },
        orderBy: {
            strength: "desc"
        }
    });

    return {
        nodes: accessibleNotes.map((note) => ({
            id: note.id,
            title: note.title,
            preview:
                note.content.length > 120
                    ? `${note.content.slice(0, 120)}...`
                    : note.content,
            access: note.ownerId === userId ? "owner" : "shared",
            created_at: note.createdAt,
            updated_at: note.updatedAt
        })),
        edges: connections.map((connection) => ({
            id: connection.id,
            source: connection.sourceNoteId,
            target: connection.targetNoteId,
            strength: Number(connection.strength.toFixed(4)),
            reason: connection.reason
        }))
    };
};