import React from "react";
import { useNavigate } from "react-router-dom";
import FaceRegister from "../components/FaceRegister/FaceRegister";
import { ScanFace, ShieldCheck } from "lucide-react";

/**
 * RegisterFacePage  –  /register-face
 * Shown to employees whose faceDescriptor is null in DB.
 * After successful registration redirects to /.
 */
const RegisterFacePage = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate("/", { replace: true });
    };

    return (
        <div className="width-full min-h-screen bg-main-gradient flex items-center justify-center">
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-(--bg-main)">
            {/* Card */}
            <div className="
                w-full max-w-md
                p-8 rounded-2xl
                border border-(--border-primary)
                bg-modal-gradient
                shadow-2xl
                flex flex-col gap-8
            ">
                {/* Page heading */}
                <div className="text-center space-y-2">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Face Registration Required</h1>
                    <p className="text-sm text-(--text-tertiary) leading-relaxed">
                        To keep attendance secure, you must register your face{" "}
                        <span className="text-white/70">before</span> you can mark check-in or check-out.
                        This is a <span className="text-blue-400 font-medium">one-time setup</span>.
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-(--border-primary)" />

                {/* Core component */}
                <FaceRegister onSuccess={handleSuccess} />
            </div>

            {/* Footer note */}
            <p className="mt-6 text-xs text-(--text-tertiary) flex items-center gap-1.5">
                <ScanFace size={13} />
                Your face data is stored securely and used only for attendance verification.
            </p>
        </div>
        </div>
    );
};

export default RegisterFacePage;
