import { searchAccessibleNotes } from "../services/search.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchNotesHandler = asyncHandler(async (req, res) => {
    const result = await searchAccessibleNotes({
        userId: req.user.id,
        query: req.validated.query.q,
        page: req.validated.query.page,
        limit: req.validated.query.limit
    });

    return res.status(200).json(result);
});