import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    PORT: z.string().default('3000').transform(Number).refine((n) => n > 0 && n < 8555),
    NODE_ENV: z.enum(['development', 'production', 'test']).default("development"),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    CORS_ORIGIN: z.string().default("*"),
    JWT_ACCESS_SECRET: z
        .string()
        .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),

    JWT_ACCESS_EXPIRES_IN: z.string().default("1h"),

    BCRYPT_SALT_ROUNDS: z
        .string()
        .default("12")
        .transform((value) => Number(value))
        .pipe(z.number().int().min(10).max(15)),
    OPENROUTER_API_KEY: z.string().optional().default(""),

    OPENROUTER_EMBEDDING_MODEL: z
        .string()
        .default("openai/text-embedding-3-small"),

    OPENROUTER_EMBEDDING_DIMENSIONS: z
        .string()
        .default("1536")
        .transform((value) => Number(value))
        .pipe(z.number().int().positive()),

    OPENROUTER_BASE_URL: z
        .url()
        .default("https://openrouter.ai/api/v1"),

    OPENROUTER_APP_NAME: z.string().default("Notes Memory Graph"),

    OPENROUTER_SITE_URL: z.url().default("http://localhost:5000"),

    HUGGINGFACE_API_KEY: z.string().optional().default(""),

    HUGGINGFACE_EMBEDDING_MODEL: z
        .string()
        .default("sentence-transformers/all-MiniLM-L6-v2"),

    HUGGINGFACE_BASE_URL: z
        .url()
        .default("https://router.huggingface.co/hf-inference")
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error("Invalid ENV's")
    console.error(parsed.error.issues)
    process.exit(1)
}

// export const config = {
//     PORT: parsed.data.PORT,
//     NODE_ENV: parsed.data.NODE_ENV
// }

export const config = parsed.data