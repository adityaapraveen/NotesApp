import { z } from "zod";

export const createNoteSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(200, "Title must be at most 200 characters"),

        content: z
            .string()
            .trim()
            .min(1, "Content is required")
            .max(20000, "Content must be at most 20000 characters")
    })
});

export const updateNoteSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid note id")
    }),

    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(200, "Title must be at most 200 characters"),

        content: z
            .string()
            .trim()
            .min(1, "Content is required")
            .max(20000, "Content must be at most 20000 characters")
    })
});

export const noteIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid note id")
    })
});

export const shareNoteSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid note id")
    }),

    body: z.object({
        share_with_email: z
            .string()
            .trim()
            .email("share_with_email must be a valid email")
            .toLowerCase()
    })
});

export const listNotesSchema = z.object({
    query: z.object({
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