import { Router } from "express";
import { getAbout, healthCheck } from "../controllers/meta.controller.js";

const router = Router();

router.get("/health", healthCheck);
router.get("/about", getAbout);

export default router;