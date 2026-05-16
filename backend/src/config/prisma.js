import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "./config.js";

const globalForPrisma = globalThis;

const adapter = new PrismaPg({
    connectionString: config.DATABASE_URL,
});

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log:
            config.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (config.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}