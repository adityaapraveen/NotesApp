import { config } from "../config/config.js";

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const isProduction = config.NODE_ENV === "production";

    const response = {
        message:
            isProduction && statusCode === 500
                ? "Internal server error"
                : err.message || "Internal server error"
    };

    if (err.details) {
        response.details = err.details;
    }

    if (!isProduction) {
        response.stack = err.stack;
    }

    return res.status(statusCode).json(response);
};