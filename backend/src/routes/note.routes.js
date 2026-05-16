import { Router } from "express";
import {
    createNoteHandler,
    deleteNoteHandler,
    getNoteByIdHandler,
    getNotesHandler,
    shareNoteHandler,
    updateNoteHandler
} from "../controllers/note.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createNoteSchema,
    listNotesSchema,
    noteIdParamSchema,
    shareNoteSchema,
    updateNoteSchema
} from "../validators/note.schema.js";

const router = Router();

router.get("/notes", requireAuth, validate(listNotesSchema), getNotesHandler);

router.post("/notes", requireAuth, validate(createNoteSchema), createNoteHandler);

router.get(
    "/notes/:id",
    requireAuth,
    validate(noteIdParamSchema),
    getNoteByIdHandler
);

router.put(
    "/notes/:id",
    requireAuth,
    validate(updateNoteSchema),
    updateNoteHandler
);

router.delete(
    "/notes/:id",
    requireAuth,
    validate(noteIdParamSchema),
    deleteNoteHandler
);

router.post(
    "/notes/:id/share",
    requireAuth,
    validate(shareNoteSchema),
    shareNoteHandler
);

export default router;