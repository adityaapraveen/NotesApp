import { app } from "./app.js";
import { config } from "./config/config.js";
import { prisma } from "./config/prisma.js";

const startServer = async () => {
    try {
        await prisma.$connect();

        app.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server");
        console.error(error);
        process.exit(1);
    }
};

startServer();