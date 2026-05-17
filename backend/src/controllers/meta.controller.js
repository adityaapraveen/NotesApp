import { openApiDocument } from "../docs/openapi.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
    return res.status(200).json({
        status: "ok",
        service: "notesApp-backend"
    });
});

export const getAbout = asyncHandler(async (req, res) => {
    return res.status(200).json({
        name: "Aditya Praveen",
        email: "adityaapraveenn18@gmail.com",
        "my features": {
            "Memory Graph":
                "Automatically connects related notes using embeddings and vector similarity. I chose this because it turns a normal CRUD notes app into a second-brain style knowledge system, And using these vector embeddings i could build so many more features later like RAG, semantic search, to learn about the user on what kind of person he is etc",
            "Pagination":
                "Keeps the notes API efficient when users have many notes.",
            "Full-text Search":
                "Helps users quickly find notes by title or content.",
            "Docker":
                "Makes the backend easier to run and deploy consistently."
        }
    });
});

export const getOpenApiJson = asyncHandler(async (req, res) => {
    return res.status(200).json(openApiDocument);
});