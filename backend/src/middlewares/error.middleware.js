import { config } from "../config/config.js";

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        message: err.message || "Internal server error"
    };

    if (err.details) {
        response.details = err.details;
    }

    if (config.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    return res.status(statusCode).json(response);
};