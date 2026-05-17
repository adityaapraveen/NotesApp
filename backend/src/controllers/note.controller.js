import {
    createNote,
    deleteOwnedNote,
    getAccessibleNoteById,
    getNotesForUser,
    shareOwnedNote,
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

    const hasPaginationQuery =
        typeof req.query.page !== "undefined" || typeof req.query.limit !== "undefined";

    if (!hasPaginationQuery) {
        return res.status(200).json(result.data);
    }

    return res.status(200).json(result);
});

export const getNoteByIdHandler = asyncHandler(async (req, res) => {
    const note = await getAccessibleNoteById({
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

export const shareNoteHandler = asyncHandler(async (req, res) => {
    const result = await shareOwnedNote({
        ownerId: req.user.id,
        noteId: req.validated.params.id,
        shareWithEmail: req.validated.body.share_with_email
    });

    return res.status(200).json(result);
});