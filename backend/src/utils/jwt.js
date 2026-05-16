import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { AppError } from "./AppError.js";

export const signAccessToken = (payload) => {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
        expiresIn: config.JWT_ACCESS_EXPIRES_IN
    });
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.JWT_ACCESS_SECRET);
    } catch {
        throw new AppError("Invalid or expired token", 401);
    }
};