import { Router } from "express";
import {
    createNoteHandler,
    deleteNoteHandler,
    getNoteByIdHandler,
    getNotesHandler,
    updateNoteHandler
} from "../controllers/note.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createNoteSchema,
    listNotesSchema,
    noteIdParamSchema,
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

export default router;