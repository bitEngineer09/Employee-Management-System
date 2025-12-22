import { refreshTheTokens, verifyToken } from "../services/auth.services.js";

export const isAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.access_token;
        const refreshToken = req.cookies?.refresh_token;

        req.user = null;

        if (accessToken) {
            try {
                const decoded = verifyToken(accessToken);
                req.user = decoded; // { id, name, email, role, sessionId }
                return next();
            } catch (err) {
                console.log("Access token invalid or expired");
            }
        }

        if (refreshToken) {
            try {
                const { newAccessToken, newRefreshToken, user } = await refreshTheTokens(refreshToken);

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
                console.log("Refresh token invalid:", err.message);
                req.user = null;
                return next();
            }
        }

        return next();
    } catch (error) {
        console.error("isAuth middleware fatal error:", error);
        req.user = null;
        return next();
    }
};
