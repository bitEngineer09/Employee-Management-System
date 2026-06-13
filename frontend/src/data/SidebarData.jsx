import {
    Home,
    IndianRupee,
    LayoutDashboard,
    Settings,
    TentTree,
    User
} from 'lucide-react';

// sidebar for admin
export const sidebarAdminContent = [
    {
        name: "Dashboard",
        icon: <LayoutDashboard />,
        path: "/",
        style:
            "border-2 border-transparent bg-emerald-700/10 hover:border-emerald-600 text-emerald-400",
    },
    {
        name: "Employees",
        icon: <User />,
        path: "/admin/emp",
        style:
            "border-2 border-transparent bg-cyan-700/10 hover:border-cyan-600 text-cyan-400",
    },
    {
        name: "Departments",
        icon: <Home />,
        path: "/admin/dept",
        style:
            "border-2 border-transparent bg-purple-700/10 hover:border-purple-600 text-purple-400",
    },
    {
        name: "Leave",
        icon: <TentTree />,
        path: "/admin/leave",
        style:
            "border-2 border-transparent bg-orange-700/10 hover:border-orange-600 text-orange-400",
    },
    {
        name: "Payroll",
        icon: <IndianRupee />,
        path: "/admin/payroll",
        style:
            "border-2 border-transparent bg-lime-700/10 hover:border-lime-600 text-lime-400",
    },
    {
        name: "Settings",
        icon: <Settings />,
        path: "/settings",
        style:
            "border-2 border-transparent bg-slate-700/10 hover:border-slate-600 text-slate-400",
    },
    {
        name: "Attendace Report",
        icon: <User />,
        path: "/attendance-report",
        style:
            "border-2 border-transparent bg-fuchsia-700/10 hover:border-fuchsia-600 text-fuchsia-400",
    },
];

// sidebar for user
export const sideBarUserContent = [
    {
        name: "Attendance",
        icon: <User />,
        path: "/",
        style:
            "border-2 border-transparent bg-cyan-700/10 hover:border-cyan-600 text-cyan-400",
    },
    {
        name: "Leave",
        icon: <TentTree />,
        path: "/emp/leave",
        style:
            "border-2 border-transparent bg-purple-700/10 hover:border-purple-600 text-purple-400",
    },
    {
        name: "Salary",
        icon: <IndianRupee />,
        path: "/emp/salary",
        style:
            "border-2 border-transparent bg-green-700/10 hover:border-green-600 text-green-400",
    },
    {
        name: "Settings",
        icon: <Settings />,
        path: "/settings",
        style:
            "border-2 border-transparent bg-amber-700/10 hover:border-amber-600 text-amber-400",
    },
]