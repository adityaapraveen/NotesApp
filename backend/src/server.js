import { app } from "./app.js";
import { config } from "./config/config.js";
import { prisma } from "./config/prisma.js";
import { withRetry } from "./utils/retry.js";

let server;

const startServer = async () => {
  try {
    await withRetry(
      async () => {
        await prisma.$connect();
      },
      {
        retries: 8,
        delayMs: 1000,
        label: "Database connection"
      }
    );

    server = app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log("Server closed.");
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection");
  console.error(reason);
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught exception");
  console.error(error);

  await prisma.$disconnect();
  process.exit(1);
});

startServer();