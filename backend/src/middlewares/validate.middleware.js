import { AppError } from "../utils/AppError.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        if (!result.success) {
            const errors = result.error.flatten();

            return next(
                new AppError("Validation failed", 400, {
                    fieldErrors: errors.fieldErrors
                })
            );
        }

        req.validated = result.data;
        return next();
    };
};