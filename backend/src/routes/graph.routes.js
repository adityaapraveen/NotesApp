import { Router } from "express";
import {
    getMemoryGraphHandler,
    rebuildNoteGraphHandler
} from "../controllers/graph.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    getGraphSchema,
    rebuildNoteGraphSchema
} from "../validators/graph.schema.js";

const router = Router();

router.get("/notes/graph", requireAuth, validate(getGraphSchema), getMemoryGraphHandler);

router.post(
    "/notes/:id/graph/rebuild",
    requireAuth,
    validate(rebuildNoteGraphSchema),
    rebuildNoteGraphHandler
);

export default router;