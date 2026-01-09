import { Activity, UserCheck, UserX } from "lucide-react";
import { attendanceStatusUI } from "./attendanceStatusUi";

export const getTodayAttendanceData = (data) => {
    const statusUI = attendanceStatusUI[data?.status] || attendanceStatusUI.ABSENT;

    return [
        {
            name: "Check-In Time",
            value: data?.checkIn
                ? new Date(data.checkIn).toLocaleTimeString()
                : "-",
            icon: <UserCheck />,
            color: "bg-emerald-600/30 text-emerald-400",
            bgColor: "bg-emerald-600/20",
            hover: "hover:border-emerald-700 hover:scale-105",
            border: "border-emerald-600",
        },
        {
            name: "Check-Out Time",
            value: data?.checkOut
                ? new Date(data.checkOut).toLocaleTimeString()
                : "-",
            icon: <UserX />,
            color: "bg-blue-600/30 text-blue-400",
            bgColor: "bg-blue-600/20",
            hover: "hover:border-blue-700 hover:scale-105",
            border: "border-blue-600",
        },
        {
            name: "Status",
            value: statusUI.label || "-",
            icon: <Activity />,
            color: statusUI.color,
            bgColor: statusUI.bgColor,
            hover: statusUI.hover,
            border: statusUI.border,
        },
    ];
};
