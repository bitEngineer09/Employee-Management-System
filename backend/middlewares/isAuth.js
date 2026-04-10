import { refreshTheTokens, verifyToken } from "../services/auth.services.js";
import { prisma } from "../utils/client.js";
import asyncHandler from "../utils/asyncHandler.js";

export const isAuth = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    req.user = null;

    if (accessToken) {
        try {
            const decoded = verifyToken(accessToken);

            const session = await prisma.session.findUnique({
                where: { id: decoded.sessionId }
            });

            if (!session || !session.valid) {
                throw new Error("Session expired");
            }

            req.user = decoded;
            return next();
        } catch (err) {
            console.log("Access token invalid or session expired");
        }
    }

    if (refreshToken) {
        try {
            const { newAccessToken, newRefreshToken, user } = await refreshTheTokens(refreshToken);

            const session = await prisma.session.findUnique({
                where: { id: user.sessionId }
            });

            if (!session || !session.valid) {
                throw new Error("Session expired");
            }

            req.user = user;

            res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 60 * 60 * 1000,
            });

            res.cookie("refresh_token", newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return next();
        } catch (err) {
            console.log("Refresh token invalid or session expired:", err.message);
            req.user = null;
        }
    }

    req.user = null;
    return next();
});