import { Home, LayoutDashboard, Settings, User } from 'lucide-react';

export const sidebarContent = [
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
        path: "/emp",
        style:
            "border-2 border-transparent bg-cyan-700/10 hover:border-cyan-600 text-cyan-400",
    },
    {
        name: "Departments",
        icon: <Home />,
        path: "/dept",
        style:
            "border-2 border-transparent bg-purple-700/10 hover:border-purple-600 text-purple-400",
    },
    {
        name: "Settings",
        icon: <Settings />,
        path: "/settings",
        style:
            "border-2 border-transparent bg-amber-700/10 hover:border-amber-600 text-amber-400",
    },
];