import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.validated.body);

    return res.status(201).json({
        message: "User registered successfully",
        user
    });
});

export const login = asyncHandler(async (req, res) => {
    const result = await loginUser(req.validated.body);

    return res.status(200).json(result);
});