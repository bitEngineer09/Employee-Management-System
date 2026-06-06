import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const requireAuth = (req, res, next) => {
    if (!req.user) throw new AppError("Authentication Required", 401)
    next();
}