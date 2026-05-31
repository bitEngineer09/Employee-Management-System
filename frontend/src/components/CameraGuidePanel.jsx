import React from "react";
import { CheckCircle2, BookOpen } from "lucide-react";

const CameraGuidePanel = () => {
    const rules = [
        "Ensure your face is clearly visible in proper light.",
        "Keep your face centered and look directly at the camera.",
        "Remove masks, sunglasses, and keep hair away from your face.",
        "Hold still for a moment while capturing your photo.",
        "Ensure your camera lens is clean for a clear image.",
    ];

    return (
        <div className="rounded-xl border border-(--border-primary) bg-modal-gradient min-w-70 max-w-75 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 text-white">
                <BookOpen size={15} className="text-orange-400" />
                <span className="text-sm font-semibold">
                    Camera Capture Guide
                </span>
            </div>

            <div className="h-px bg-white/8 mx-4" />

            {/* Rules */}
            <div className="p-4">
                <ul className="flex flex-col gap-3">
                    {rules.map((rule) => (
                        <li key={rule} className="flex items-start gap-2">
                            <CheckCircle2
                                size={14}
                                className="mt-0.5 shrink-0 text-green-400"
                            />
                            <span className="text-xs text-(--text-tertiary) leading-relaxed">
                                {rule}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CameraGuidePanel;