import {
    createNote,
    deleteOwnedNote,
    getNotesForUser,
    getOwnedNoteById,
    updateOwnedNote
} from "../services/note.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNoteHandler = asyncHandler(async (req, res) => {
    const note = await createNote({
        userId: req.user.id,
        title: req.validated.body.title,
        content: req.validated.body.content
    });

    return res.status(201).json(note);
});

export const getNotesHandler = asyncHandler(async (req, res) => {
    const result = await getNotesForUser({
        userId: req.user.id,
        page: req.validated.query.page,
        limit: req.validated.query.limit
    });

    return res.status(200).json(result);
});

export const getNoteByIdHandler = asyncHandler(async (req, res) => {
    const note = await getOwnedNoteById({
        userId: req.user.id,
        noteId: req.validated.params.id
    });

    return res.status(200).json(note);
});

export const updateNoteHandler = asyncHandler(async (req, res) => {
    const note = await updateOwnedNote({
        userId: req.user.id,
        noteId: req.validated.params.id,
        title: req.validated.body.title,
        content: req.validated.body.content
    });

    return res.status(200).json(note);
});

export const deleteNoteHandler = asyncHandler(async (req, res) => {
    await deleteOwnedNote({
        userId: req.user.id,
        noteId: req.validated.params.id
    });

    return res.status(204).send();
});