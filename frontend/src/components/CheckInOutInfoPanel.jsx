import React from "react";
import { CalendarDays, Info, AlertCircle } from "lucide-react";

const CheckInOutInfoPanel = () => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const dayName = today.toLocaleDateString("en-IN", { weekday: "long" });

    return (
        <div
            className="
                flex-1
                flex flex-col gap-4
                p-5 rounded-xl
                border border-(--border-primary)
                bg-modal-gradient
                text-(--text-secondary)
            ">
            {/* Date */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                    <CalendarDays size={18} />
                </div>
                <div>
                    <p className="text-sm text-(--text-tertiary)">Today</p>
                    <p className="font-semibold text-white">
                        {dayName}, {formattedDate}
                    </p>
                </div>
            </div>

            {/* Info */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10 text-green-400 mt-1">
                    <Info size={16} />
                </div>
                <p className="text-sm leading-relaxed">
                    Please make sure to <span className="text-green-400 font-medium">check in</span> when you start your work
                    and <span className="text-blue-400 font-medium">check out</span> before leaving for the day.
                </p>
            </div>

            {/* Warning */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-400 mt-1">
                    <AlertCircle size={16} />
                </div>
                <p className="text-sm text-yellow-400">
                    Missing check-out may affect your working hours and salary calculation.
                </p>
            </div>
        </div>
    );
};

export default CheckInOutInfoPanel;
