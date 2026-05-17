import { config } from "../config/config.js";
import { prisma } from "../config/prisma.js";

const buildEmbeddingInput = ({ title, content }) => {
    return `Title: ${title}\n\nContent: ${content}`;
};

const getHuggingFaceEmbeddingUrl = () => {
    return `${config.HUGGINGFACE_BASE_URL}/models/${config.HUGGINGFACE_EMBEDDING_MODEL}/pipeline/feature-extraction`;
};

const normalizeEmbeddingResponse = (data) => {
    if (Array.isArray(data) && data.every((value) => typeof value === "number")) {
        return data;
    }

    if (
        Array.isArray(data) &&
        Array.isArray(data[0]) &&
        data[0].every((value) => typeof value === "number")
    ) {
        return data[0];
    }

    if (
        Array.isArray(data) &&
        Array.isArray(data[0]) &&
        Array.isArray(data[0][0])
    ) {
        const tokenVectors = data[0];

        const dimension = tokenVectors[0].length;
        const pooled = new Array(dimension).fill(0);

        for (const tokenVector of tokenVectors) {
            for (let index = 0; index < dimension; index += 1) {
                pooled[index] += Number(tokenVector[index]);
            }
        }

        return pooled.map((value) => value / tokenVectors.length);
    }

    throw new Error("Hugging Face response did not contain a valid embedding vector.");
};

export const generateEmbedding = async ({ title, content }) => {
    if (!config.HUGGINGFACE_API_KEY) {
        console.warn("HUGGINGFACE_API_KEY is not set. Skipping embedding generation.");
        return null;
    }

    const response = await fetch(getHuggingFaceEmbeddingUrl(), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: buildEmbeddingInput({ title, content }),
            options: {
                wait_for_model: true
            }
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Hugging Face embedding request failed with status ${response.status}: ${errorBody}`
        );
    }

    const data = await response.json();
    const embedding = normalizeEmbeddingResponse(data);

    if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error("Generated embedding is empty.");
    }

    return embedding;
};

export const upsertNoteEmbedding = async ({ noteId, title, content }) => {
    const vector = await generateEmbedding({
        title,
        content
    });

    if (!vector) {
        return null;
    }

    const embedding = await prisma.noteEmbedding.upsert({
        where: {
            noteId
        },
        create: {
            noteId,
            model: config.HUGGINGFACE_EMBEDDING_MODEL,
            dimension: vector.length,
            vector
        },
        update: {
            model: config.HUGGINGFACE_EMBEDDING_MODEL,
            dimension: vector.length,
            vector
        }
    });

    return embedding;
};

export const safelyUpsertNoteEmbedding = async ({ noteId, title, content }) => {
    try {
        return await upsertNoteEmbedding({
            noteId,
            title,
            content
        });
    } catch (error) {
        console.error("Failed to upsert note embedding");
        console.error(error);
        return null;
    }
};