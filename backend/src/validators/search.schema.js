import { z } from "zod";

export const searchNotesSchema = z.object({
    query: z.object({
        q: z
            .string()
            .trim()
            .min(1, "Search query is required")
            .max(100, "Search query must be at most 100 characters"),

        page: z
            .string()
            .optional()
            .default("1")
            .transform((value) => Number(value))
            .pipe(z.number().int().positive()),

        limit: z
            .string()
            .optional()
            .default("10")
            .transform((value) => Number(value))
            .pipe(z.number().int().positive().max(50))
    })
});