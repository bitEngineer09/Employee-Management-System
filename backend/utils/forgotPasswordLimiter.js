import rateLimt from 'express-rate-limit';

export const forgotPasswordLimiter = rateLimt({
    windowMs: 15 * 60 * 1000, // 15 mins,
    max: 3, // max 3 req per 15 mins,
    message: "Too many password reset requests from this IP, please try again later",
});