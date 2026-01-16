import React, { useState } from "react";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useForgotPassword from "../hooks/Auth/useForgotPassword";
import useResetPassword from "../hooks/Auth/useResetPassword";
import ButtonLoader from "../components/Loader/ButtonLoader";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = email, 2 = otp + new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const { forgotPassword, isLoading: forgotLoading } = useForgotPassword();
    const { resetPassword, isLoading: resetLoading, error } = useResetPassword();

    // handle send otp
    const handleSendOtp = (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        forgotPassword(
            { email },
            {
                onSuccess: () => {
                    setStep(2); // move to OTP step
                },
            }
        );
    };

    // STEP 2 – Reset Password
    const handleResetPassword = (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        resetPassword(
            {
                email,
                otp,
                newPassword,
            },
            {
                onSuccess: () => {
                    navigate("/auth");
                },
            }
        );
    };

    return (
        <div className="flex h-screen items-center justify-center bg-auth-gradient px-4">
            <div className="w-full max-w-md bg-login-card border border-(--border-secondary) rounded-2xl p-6 sm:p-8 shadow-2xl">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="
                        w-12 h-12
                        flex items-center justify-center 
                        bg-(--blue-active)/20
                        rounded-xl border border-(--blue-primary)
                    ">
                        {
                            step === 1 ? (
                                <Mail className="w-6 h-6 text-blue-400" />
                            ) : (
                                <KeyRound className="w-6 h-6 text-blue-400" />
                            )
                        }
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-(--text-primary)">
                            {step === 1 ? "Forgot Password" : "Reset Password"}
                        </h2>
                        <p className="text-sm text-(--text-tertiary) mt-0.5">
                            {step === 1
                                ? "Enter your registered email"
                                : "Enter OTP and new password"}
                        </p>
                    </div>
                </div>

                {/* STEP 1 – EMAIL */}
                {
                    step === 1 && (
                        <form onSubmit={handleSendOtp} className="flex flex-col gap-4 mt-6">
                            <InputCard
                                label={"Email"}
                                type={"email"}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={"Enter your email"}
                            />

                            <Button loading={forgotLoading} header={"Send OTP"} />
                        </form>
                    )
                }

                {/* STEP 2 – OTP + NEW PASSWORD */}
                {
                    step === 2 && (
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-4 mt-6">
                            <InputCard
                                type={"text"}
                                label={"OTP"}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder={"Enter 6 digit OTP"}
                            />

                            <InputCard
                                type={"password"}
                                label={"New Password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder={"Enter new password"}
                            />

                            <InputCard
                                type={"password"}
                                label={"Confirm Password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={"Confirm new password"}
                            />

                            {/* Error */}
                            {
                                error && (
                                    <div
                                        className="
                                        border border-red-500
                                        bg-red-950/50 text-red-200
                                        rounded-lg p-3 text-sm
                                    ">
                                        {error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || "Something went wrong"}
                                    </div>
                                )
                            }

                            {/* Reset password button */}
                            <Button loading={resetLoading} header={"Reset Password"} />
                        </form>
                    )
                }

                {/* Back to login */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-(--text-tertiary)">
                    <ArrowLeft size={16} />
                    <span
                        onClick={() => navigate("/auth")}
                        className="cursor-pointer hover:text-(--text-secondary) hover:underline transition-colors"
                    >
                        Back to Login
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

const InputCard = ({ label, type, value, onChange, placeholder }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm text-(--text-secondary) font-medium">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={label === "OTP" && 6}
            className="
            bg-slate-900/50
            border border-slate-700
            rounded-lg 
            py-2.5 px-3
            text-sm text-(--text-secondary)
            outline-none
            focus:border-(--blue-primary)
            focus:ring-1
            focus:ring-(--blue-primary)
            transition-colors
            placeholder:text-(--text-tertiary)
            "/>
    </div>
);

const Button = ({ loading, header }) => (
    <button
        type="submit"
        disabled={loading}
        className="
        w-full py-2.5 mt-2
        font-semibold rounded-lg
        cursor-pointer 
        bg-(--blue-hover) text-(--text-primary)
        hover:bg-(--blue-primary)
        active:bg-(--blue-active)
        transition-colors
        flex items-center justify-center
        disabled:cursor-not-allowed 
        disabled:opacity-50
        disabled:hover:bg-(--blue-hover)
        ">
        {loading ? <ButtonLoader /> : header}
    </button>
);