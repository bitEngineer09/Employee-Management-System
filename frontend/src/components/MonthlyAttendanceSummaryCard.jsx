import React, { useState } from "react";
import useGetMohtlyAttendanceSummary from '../hooks/User/Attendance/useGetMonthlyAttendanceSummary';
import { Calendar } from "lucide-react";
import { getMonthlyAttendanceCardData } from "../data/MonthlyAttendanceCardData";

const MonthlyAttendanceSummaryCard = () => {

    const [month, setMonth] = useState("");

    const { getMonthlyEmpAttendance, error } = useGetMohtlyAttendanceSummary(month);
    const summary = getMonthlyEmpAttendance?.summary;
    const cardsData = summary ? getMonthlyAttendanceCardData(summary) : [];


    return (
        <div className="mt-8">

            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">
                        Monthly Attendance Summary
                    </h2>

                    {!month && (
                        <p className="text-(--text-tertiary) text-center">
                            ( Please select a month to view summary )
                        </p>
                    )}
                </div>

                {/* Month Picker */}
                <div className="flex items-center gap-2">
                    <label htmlFor="monthPicker" className="cursor-pointer">
                        <Calendar size={32} className="text-blue-400" />
                    </label>
                    <input
                        title="Month, year"
                        type="month"
                        id="monthPicker"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="
                        bg-black border border-(--border-primary)
                        text-(--text-secondary)
                        rounded-lg px-4 py-2
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        scheme-dark
                        "/>
                </div>
            </div>

            {error && (
                <p className="text-red-400">Failed to load attendance summary</p>
            )}

            {/* Cards */}
            {cardsData.length > 0 && (
                <div className="grid grid-cols-4 gap-6">
                    {cardsData.map((card, index) => {
                        const { name, value, color, icon, hover, bgColor } = card;
                        return (
                            <div
                                key={index}
                                className={`
                                    border-2 border-transparent
                                    flex items-center justify-between
                                    text-(--text-secondary)
                                    bg-(--bg-primary)
                                    p-5 rounded-2xl
                                    transition-all
                                    ${bgColor}
                                    ${hover}
                                `}>
                                <div className='flex flex-col gap-2'>
                                    <p>{name}</p>
                                    <p className='text-3xl font-medium'>{value}</p>
                                </div>
                                <div
                                    className={`
                                        size-12
                                        text-2xl
                                        flex items-center justify-center
                                        rounded-full
                                        ${color}
                                        `}>
                                    {icon}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    );
};

export default MonthlyAttendanceSummaryCard;
