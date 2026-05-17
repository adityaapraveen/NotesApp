import { openApiDocument } from "../docs/openapi.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
    return res.status(200).json({
        status: "ok",
        service: "notesApp-backend",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

export const getAbout = asyncHandler(async (req, res) => {
    return res.status(200).json({
        name: "Aditya Praveen",
        email: "adityaapraveenn18@gmail.com",
        "my features": {
            "Memory Graph": "Automatically connects related notes using embeddings and vector similarity. I chose this because it turns a basic CRUD notes app into a second-brain style knowledge system where users can discover relationships between their ideas. This also creates a strong foundation for future features like semantic search, RAG-based question answering, personalized knowledge retrieval, and intelligent note recommendations.",

            "Pagination": "Improves performance and scalability by returning notes in smaller chunks instead of loading every note at once. I chose this because real users can have hundreds or thousands of notes, and paginated APIs are safer for the database, backend, and frontend.",

            "Full-text Search": "Allows users to quickly find notes by matching keywords across note titles and content. I chose this because search is one of the most important features in a notes product, especially as the number of notes grows.",

            "Docker": "Makes the backend easier to run, test, and deploy consistently across different environments. I chose this because Docker reduces setup issues and keeps local development closer to production."
        }
    });
});

export const getOpenApiJson = asyncHandler(async (req, res) => {
    return res.status(200).json(openApiDocument);
});