import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    PORT: z.string().default('3000').transform(Number).refine((n) => n > 0 && n < 8555),
    NODE_ENV: z.enum(['development', 'production', 'test']),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error("Invalid ENV's")
    console.error(parsed.error.issues)
    process.exit(1)
}

export const config = {
    PORT: parsed.data.PORT,
    NODE_ENV: parsed.data.NODE_ENV
}