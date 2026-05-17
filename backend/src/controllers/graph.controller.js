import {
    getMemoryGraphForUser,
    rebuildConnectionsForNote
} from "../services/graph.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMemoryGraphHandler = asyncHandler(async (req, res) => {
    const graph = await getMemoryGraphForUser({
        userId: req.user.id,
        minStrength: req.validated.query.min_strength
    });

    return res.status(200).json(graph);
});

export const rebuildNoteGraphHandler = asyncHandler(async (req, res) => {
    const result = await rebuildConnectionsForNote({
        userId: req.user.id,
        noteId: req.validated.params.id
    });

    return res.status(200).json(result);
});