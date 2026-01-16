import { CalendarDays } from "lucide-react";
import { useEffect, useRef } from "react";

const HolidayCard = ({ holiday, index }) => {
    const dateObj = new Date(holiday.date);

    const day = dateObj.toLocaleDateString("en-IN", { day: "2-digit" });
    const month = dateObj.toLocaleDateString("en-IN", { month: "short" });
    const weekday = dateObj.toLocaleDateString("en-IN", { weekday: "long" });

    const rotationRef = useRef("0");

    useEffect(() => {
        rotationRef.current = (Math.random() * 4 - 2).toFixed(2);
    }, []);

    const colors = [
        "from-yellow-400 to-orange-500",
        "from-pink-400 to-rose-500",
        "from-cyan-400 to-blue-500",
        "from-green-400 to-emerald-500",
        "from-purple-400 to-indigo-500",
        "from-rose-400 to-rose-500",
        "from-teal-400 to-cyan-500",
        "from-amber-400 to-yellow-500",
    ];

    const shadowColors = [
        "shadow-yellow-500/30",
        "shadow-pink-500/30",
        "shadow-cyan-500/30",
        "shadow-green-500/30",
        "shadow-purple-500/30",
        "shadow-red-500/30",
        "shadow-teal-500/30",
        "shadow-amber-500/30",
    ];

    const colorClass = colors[index % colors.length];
    const shadowClass = shadowColors[index % shadowColors.length];


    return (
        <div className="group relative">
            <div
                className={
                    `relative p-4 bg-linear-to-br ${colorClass} rounded-lg shadow-xl ${shadowClass}
                transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-2xl
                cursor-pointer
                `}
                style={{ transform: `rotate(${rotationRef}deg)` }}
            >
                <div className="flex items-center justify-center mb-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                        <div className="text-2xl font-bold text-gray-800 leading-none">{day}</div>
                        <div className="text-xs font-semibold text-gray-600 uppercase mt-1">{month}</div>
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 drop-shadow-md">
                        {holiday.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-white/90" />
                        <p className="text-white/90 text-xs font-medium">{weekday}</p>
                    </div>
                </div>

                <div
                    className="
                    absolute -top-2 left-1/2
                    -translate-x-1/2 
                    w-12 h-4
                    bg-gray-700/40
                    backdrop-blur-sm
                    rounded-sm shadow-md
                "/>
            </div>
        </div>
    );
};

export default HolidayCard;