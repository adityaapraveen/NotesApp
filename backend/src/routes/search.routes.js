import { Router } from "express";
import { searchNotesHandler } from "../controllers/search.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { searchNotesSchema } from "../validators/search.schema.js";

const router = Router();

router.get("/search", requireAuth, validate(searchNotesSchema), searchNotesHandler);

export default router;