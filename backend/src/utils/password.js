import bcrypt from "bcryptjs";
import { config } from "../config/config.js";

export const hashPassword = async (plainPassword) => {
    return bcrypt.hash(plainPassword, config.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (plainPassword, passwordHash) => {
    return bcrypt.compare(plainPassword, passwordHash);
};