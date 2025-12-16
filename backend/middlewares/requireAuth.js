export const requireAuth = async(req, res, next) => {
    if (!req.user) return res.status(400).json({
        success: false,
        message: "Authentication Required"
    })
    next();
}