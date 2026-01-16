import React, { useState } from "react";
import useGetEmpAttendance from "../hooks/User/Attendance/useGetEmpAttendance";
import ButtonLoader from "./Loader/ButtonLoader";

const tableHeader = [
    { name: "Date" },
    { name: "Check In" },
    { name: "Check Out" },
    { name: "Working Hours" },
    { name: "Status" },
];

const AttendanceTable = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const { getEmpAttendance, isLoading, error, fetchAttendance, } = useGetEmpAttendance(from, to);

    const attendance = getEmpAttendance?.data?.attendance || [];

    const getStatus = (status) => {
        switch (status) {
            case "PRESENT":
                return "bg-green-950 text-green-300 border border-green-800";
            case "HALF_DAY":
                return "bg-yellow-950 text-yellow-300 border border-yellow-800";
            case "ABSENT":
                return "bg-red-950 text-red-300 border border-red-800";
            case "LEAVE_PAID":
                return "bg-blue-950 text-blue-300 border border-blue-800";
            case "LEAVE_UNPAID":
                return "bg-gray-800 text-gray-300 border border-gray-600";
            default:
                return "bg-gray-900 text-gray-300 border border-gray-700";
        }
    };

    // handle attendance
    const handleGetAttendance = () => {
        if (!from || !to) return;
        fetchAttendance();
    };

    return (
        <div className="mt-11">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-(--text-primary)">
                    My Attendance Record
                </h2>

                {/* Filters */}
                <div className="flex gap-3 items-center">
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="px-3 py-2 rounded-md bg-slate-800 border border-(--border-primary) text-(--text-secondary) scheme-dark"
                    />

                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="px-3 py-2 rounded-md bg-slate-800 border border-(--border-primary) text-(--text-secondary) scheme-dark"
                    />

                    <button
                        onClick={handleGetAttendance}
                        disabled={!from || !to || isLoading}
                        className="w-45 px-4 py-2 cursor-pointer rounded-full bg-(--blue-primary) text-(--text-primary) disabled:opacity-50"
                    >
                        {isLoading ? <ButtonLoader /> : "Get Attendance"}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-400 mb-4">
                    {error?.response?.data?.message || "Failed to load attendance"}
                </p>
            )}

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border border-(--border-primary) border-collapse">
                    <thead className="bg-blue-700/20 border-b border-(--border-primary)">
                        <tr>
                            {tableHeader?.map((head, i) => (
                                <th
                                    key={i}
                                    className="
                                    px-6 py-3 text-left 
                                    text-xs font-medium
                                    uppercase tracking-wider 
                                    text-(--text-secondary)
                                    bg-table-header
                                ">
                                    {head.name}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-black/50 text-(--text-secondary)">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-6 text-center">
                                    Loading attendance...
                                </td>
                            </tr>
                        ) : attendance?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-6 text-center">
                                    No attendance records found
                                </td>
                            </tr>
                        ) : (
                            attendance?.map((day, index) => {
                                const checkIn = day?.checkIn ? new Date(day.checkIn) : null;
                                const checkOut = day?.checkOut ? new Date(day.checkOut) : null;
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-(--border-primary)"
                                    >
                                        {/* date */}
                                        <td className="px-6 py-4 text-(--text-secondary)">
                                            {new Date(day.date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                timeZone: "Asia/Kolkata",
                                            })}
                                        </td>

                                        {/* check-in time */}
                                        <td className="px-6 py-4 text-(--text-secondary)">
                                            {checkIn ? checkIn.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }) : "-"}
                                        </td>

                                        {/* check-out time */}
                                        <td className="px-6 py-4 text-(--text-secondary)">
                                            {checkOut ? checkOut.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }) : "-"}
                                        </td>

                                        {/* working hours */}
                                        <td className="px-6 py-4 text-(--text-secondary)">
                                            {day?.workingHours || 0}
                                        </td>

                                        {/* status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatus(day.status)}`}
                                            >
                                                {day.status}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;
