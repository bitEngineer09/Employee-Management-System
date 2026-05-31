import AppError from "../utils/AppError.js";

export const isAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") throw new AppError("Admin Access Required", 403);
    next();
}