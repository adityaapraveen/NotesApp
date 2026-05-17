import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config/config.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRateLimiter, generalRateLimiter } from "./middlewares/rateLimit.middleware.js";


import authRoutes from "./routes/auth.routes.js"
import metaRoutes from "./routes/meta.routes.js";
import noteRoutes from "./routes/note.routes.js";
import searchRoutes from "./routes/search.routes.js"
import graphRoutes from "./routes/graph.routes.js";

export const app = express();

app.use(helmet());

app.use(
    cors({
        origin: config.CORS_ORIGIN === "*" ? "*" : config.CORS_ORIGIN,
        credentials: true
    })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// app.use(generalRateLimiter);

app.use(metaRoutes);
// app.use(authRateLimiter, authRoutes);
app.use(authRoutes)
app.use(graphRoutes);
app.use(noteRoutes);
app.use(searchRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);