import { z } from "zod";

export const rebuildNoteGraphSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid note id")
    })
});

export const getGraphSchema = z.object({
    query: z.object({
        min_strength: z
            .string()
            .optional()
            .default("0")
            .transform((value) => Number(value))
            .pipe(z.number().min(0).max(1))
    })
});