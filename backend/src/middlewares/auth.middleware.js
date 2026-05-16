import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication token is required", 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError("Authentication token is required", 401);
        }

        const decoded = verifyAccessToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.sub
            },
            select: {
                id: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new AppError("Authenticated user no longer exists", 401);
        }

        req.user = user;

        return next();
    } catch (error) {
        return next(error);
    }
};