import { CheckCircle, XCircle, AlertTriangle, Clock, Ban } from "lucide-react";

export const getMonthlyAttendanceCardData = (data) => [
    {
        name: "Present",
        value: data?.PRESENT || 0,
        icon: <CheckCircle size={28} />,
        color: "bg-emerald-600/30 text-emerald-400",
        bgColor: "bg-emerald-600/20",
        hover: "hover:border-emerald-700 hover:scale-105",
        border: "border-emerald-600",
    },
    {
        name: "Half Day",
        value: data?.HALF_DAY || 0,
        icon: <AlertTriangle size={28} />,
       color: "bg-amber-600/30 text-amber-400",
        bgColor: "bg-amber-600/20",
        hover: "hover:border-amber-700 hover:scale-105",
        border: "border-amber-600",
    },
    {
        name: "Absent",
        value: data?.ABSENT || 0,
        icon: <Ban size={28} />,
        color: "bg-red-600/30 text-red-400",
        bgColor: "bg-red-600/20",
        hover: "hover:border-red-700 hover:scale-105",
        border: "border-red-600",
    },
    {
        name: "Working Hours",
        value: data?.totalWorkingHours || "0",
        icon: <Clock size={28} />,
        color: "bg-blue-600/30 text-blue-400",
        bgColor: "bg-blue-600/20",
        hover: "hover:border-blue-700 hover:scale-105",
        border: "border-blue-600",
    },
];
