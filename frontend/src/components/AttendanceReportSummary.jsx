import React, { useState } from "react";
import { Calendar, CheckCircle, AlertCircle, Umbrella, Ban, User, Building2 } from "lucide-react";
import useMonthlyEmployeeAttendance from "../hooks/Admin/Attendance/useMonthlyEmployeeAttendance";
import useDepartmentAttendanceSummary from "../hooks/Admin/Attendance/useDepartmentAttendanceSummary";

const CARDS = [
    {
        key: "PRESENT",
        name: "Present",
        icon: <CheckCircle size={28} />,
        color: "bg-emerald-600/30 text-emerald-400",
        bgColor: "bg-emerald-600/20",
        hover: "hover:border-emerald-700 hover:scale-105",
    },
    {
        key: "ABSENT",
        name: "Absent",
        icon: <Ban size={28} />,
        color: "bg-red-600/30 text-red-400",
        bgColor: "bg-red-600/20",
        hover: "hover:border-red-700 hover:scale-105",
    },
    {
        key: "HALF_DAY",
        name: "Half Day",
        icon: <AlertCircle size={28} />,
        color: "bg-amber-600/30 text-amber-400",
        bgColor: "bg-amber-600/20",
        hover: "hover:border-amber-700 hover:scale-105",
    },
    {
        key: "LEAVE",
        name: "On Leave",
        icon: <Umbrella size={28} />,
        color: "bg-blue-600/30 text-blue-400",
        bgColor: "bg-blue-600/20",
        hover: "hover:border-blue-700 hover:scale-105",
    },
];

// Custom hooks to fetch and process data for employee and department modes
const useEmployeeData = (id, month) => {
    const enabled = !!id && !!month;
    const { employeeAttendance, isLoading, error } = useMonthlyEmployeeAttendance(id, month, enabled);

    const summary = employeeAttendance?.summary ?? null;
    const emp = employeeAttendance?.employee;

    const getValue = (key) => {
        if (!summary) return "—";
        if (key === "LEAVE") return (summary.LEAVE_PAID ?? 0) + (summary.LEAVE_UNPAID ?? 0);
        return summary[key] ?? 0;
    };

    const label = emp ? `${emp.name} (${emp.employeeId})` : null;

    return { getValue, isLoading, error, label, hasData: !!summary };
};

const useDepartmentData = (id, from, to) => {
    const enabled = !!id && !!from && !!to;
    const { departmentAttendanceSummary, isLoading, error } = useDepartmentAttendanceSummary(id, from, to, enabled);

    // groupBy returns [{ status: "PRESENT", _count: { status: 5 } }, ...]
    const summaryMap = {};
    if (departmentAttendanceSummary?.summary) {
        departmentAttendanceSummary.summary.forEach(({ status, _count }) => {
            summaryMap[status] = _count.status;
        });
    }

    const getValue = (key) => {
        if (!departmentAttendanceSummary) return "—";
        if (key === "LEAVE") return (summaryMap["LEAVE_PAID"] ?? 0) + (summaryMap["LEAVE_UNPAID"] ?? 0);
        return summaryMap[key] ?? 0;
    };

    return { getValue, isLoading, error, label: null, hasData: !!departmentAttendanceSummary };
};


// Main component
const AttendanceReportSummary = ({ mode = "employee" }) => {
    const isEmployee = mode === "employee";

    // Employee fields
    const [employeeId, setEmployeeId] = useState("");
    const [month, setMonth] = useState("");

    // Department fields
    const [departmentId, setDepartmentId] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const employeeData = useEmployeeData(employeeId, month);
    const departmentData = useDepartmentData(departmentId, from, to);

    const { getValue, isLoading, error, label, hasData } = isEmployee ? employeeData : departmentData;

    const allFilled = isEmployee
        ? !!employeeId && !!month
        : !!departmentId && !!from && !!to;

    return (
        <div className="mt-8 border border-(--border-primary) rounded-xl p-3">

            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6 border border-(--border-primary) rounded-lg px-4 py-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">

                    <div className="flex items-center gap-2">
                        {isEmployee
                            ? <User size={20} className="text-blue-400" />
                            : <Building2 size={20} className="text-blue-400" />
                        }
                        <h2 className="text-xl font-semibold text-white">
                            {isEmployee ? "Employee" : "Department"} Attendance Summary
                        </h2>
                    </div>

                    {label && (
                        <span className="text-(--text-tertiary) text-sm">— {label}</span>
                    )}

                    {!allFilled && (
                        <p className="text-(--text-tertiary) text-sm">
                            ({isEmployee
                                ? "Enter employee ID and select a month"
                                : "Fill department ID, from and to dates"})
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">

                    {isEmployee ? (
                        <>
                            {/* Employee ID */}
                            <input
                                type="number"
                                placeholder="Employee ID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="
                                    w-36 bg-slate-800 border border-(--border-primary)
                                    text-(--text-secondary) placeholder:text-(--text-tertiary)
                                    rounded-lg px-4 py-2
                                "
                            />

                            {/* Month picker */}
                            <label htmlFor="empMonthPicker" className="cursor-pointer">
                                <Calendar size={28} className="text-blue-400" />
                            </label>
                            <input
                                id="empMonthPicker"
                                type="month"
                                title="Month, year"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="
                                    bg-slate-800 border border-(--border-primary)
                                    text-(--text-secondary) rounded-lg px-4 py-2
                                    scheme-dark
                                "
                            />
                        </>
                    ) : (
                        <>
                            {/* Department ID */}
                            <input
                                type="number"
                                placeholder="Department ID"
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                className="
                                    w-36 bg-slate-800 border border-(--border-primary)
                                    text-(--text-secondary) placeholder:text-(--text-tertiary)
                                    rounded-lg px-4 py-2
                                "
                            />

                            {/* From */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="fromDate" className="text-(--text-tertiary) text-sm">From</label>
                                <input
                                    id="fromDate"
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="
                                        bg-slate-800 border border-(--border-primary)
                                        text-(--text-secondary) rounded-lg px-4 py-2
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        scheme-dark
                                    "
                                />
                            </div>

                            {/* To */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="toDate" className="text-(--text-tertiary) text-sm">To</label>
                                <input
                                    id="toDate"
                                    type="date"
                                    value={to}
                                    min={from}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="
                                        bg-slate-800 border border-(--border-primary)
                                        text-(--text-secondary) rounded-lg px-4 py-2
                                        scheme-dark
                                    "
                                />
                            </div>

                            <Calendar size={28} className="text-blue-400" />
                        </>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-400 mb-4">
                    Failed to load {isEmployee ? "employee" : "department"} attendance summary.
                </p>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Cards */}
            {!isLoading && hasData && (
                <div className="grid grid-cols-4 gap-6">
                    {CARDS.map((card, index) => (
                        <div
                            key={index}
                            className={`
                                border-2 border-transparent
                                flex items-center justify-between
                                text-(--text-secondary)
                                ${card.bgColor}
                                p-5 rounded-2xl transition-all
                                ${card.hover}
                            `}
                        >
                            <div className="flex flex-col gap-2">
                                <p>{card.name}</p>
                                <p className="text-3xl font-medium">{getValue(card.key)}</p>
                            </div>
                            <div className={`size-12 flex items-center justify-center rounded-full ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default AttendanceReportSummary;