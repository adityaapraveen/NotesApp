import { Router } from "express";
import {
    getAbout,
    getOpenApiJson,
    healthCheck
} from "../controllers/meta.controller.js";

const router = Router();

router.get("/health", healthCheck);
router.get("/about", getAbout);
router.get("/openapi.json", getOpenApiJson);

export default router;