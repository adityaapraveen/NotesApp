import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";

export const registerUser = async ({ email, password }) => {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new AppError("User with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = signAccessToken({
        sub: user.id,
        email: user.email
    });

    return {
        access_token: accessToken
    };
};