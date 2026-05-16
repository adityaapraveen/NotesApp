import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
    return res.status(200).json({
        status: "ok",
        service: "notesApp-backend",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

export const getAbout = asyncHandler(async (req, res) => {
    return res.status(200).json({
        name: "Aditya Praveen",
        email: "adityaapraveenn18@gmail.com",
        "my features": {
            "Memory Graph": "Automatically connects related notes using embeddings and vector similarity. I chose this because it turns a normal CRUD notes app into a second-brain style knowledge system.",
            "Pagination": "Keeps the notes API efficient when users have many notes.",
            "Full-text Search": "Helps users quickly find notes by title or content.",
            "Docker": "Makes the backend easier to run and deploy consistently."
        }
    });
});