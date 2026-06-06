import jwt from 'jsonwebtoken';
import { prisma } from '../utils/client.js';

//! COOKIES PART -------------------------------------------------------------------
export const createSession = async ({ ip, userAgent, userId }) => {
    return await prisma.session.create({
        data: { ip, userAgent, userId }
    });
}

export const createAccessToken = ({ id, name, email, role, sessionId }) => {
    return jwt.sign(
        { id, name, email, role, sessionId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" }
    );
}

export const createRefreshToken = (sessionId) => {
    return jwt.sign(
        { sessionId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );
}


export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}


//? AUTHENTICATE Function
export const authenticate = async (req, res, user) => {
    const { id, name, email, role } = user;

    // remove all previous sessions
    await prisma.session.updateMany({
        where: { userId: id, valid: true },
        data: { valid: false }
    });

    const session = await createSession({
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        userId: id,
    })

    const accessToken = createAccessToken({
        id,
        name,
        email,
        role,
        sessionId: session.id
    })

    const refreshToken = createRefreshToken(session.id);

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}


// REFRESH THE TOKENS
export const refreshTheTokens = async (refreshToken) => {
    try {
        const decodedToken = verifyRefreshToken(refreshToken);
        // console.log("Decoded refresh token:", decodedToken);
        if (!decodedToken) throw new Error("Invalid session")

        const currentSession = await prisma.session.findUnique({
            where: {
                id: decodedToken.sessionId
            }
        });
        if (!currentSession) throw new Error("Invalid session");

        if (!currentSession.valid) throw new Error("Session expired");

        const user = await prisma.user.findUnique({
            where: {
                id: currentSession.userId
            }
        });
        if (!user) throw new Error("Invalid session");

        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, 
            sessionId: currentSession.id,
        }

        const newAccessToken = createAccessToken(userInfo);

        const newRefreshToken = createRefreshToken(currentSession.id);

        return { newAccessToken, newRefreshToken, user: userInfo };

    } catch (error) {
        console.log(`refresh the token method error:${error}`);
        throw error;
    }
}

// DELETE SESSION BY SESSION ID
export const clearSession = async (sessionId) => {
    return await prisma.session.update({
        where: { id: sessionId },
        data: {valid: false}, // soft delete
    });
}