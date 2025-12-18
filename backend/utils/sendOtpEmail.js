import nodemailer from "nodemailer";

export const sendOtpToEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"EMS support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset OTP",
        html: `
            <h2>Password Reset</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>Valid for 10 minutes</p>
        `,
    });
}