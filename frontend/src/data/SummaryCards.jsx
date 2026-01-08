import { Ban, CircleCheck, House, UserCheck, Users, UserX } from "lucide-react";

// dashboard cards
export const getDashboardStatsCard = (data) => [
    {
        name: "Total Employees",
        number: data?.totalEmployees,
        icon: <Users />,
        color: "bg-blue-600/20 text-blue-400",
        bgColor: "bg-blue-600/10"
    },
    {
        name: "Present Employees",
        number: data?.presentEmployees,
        icon: <UserCheck />,
        color: "bg-green-600/20 text-green-400",
        bgColor: "bg-green-600/10"
    },
    {
        name: "Absent Employees",
        number: data?.absentEmployees,
        icon: <UserX />,
        color: "bg-red-600/20 text-red-400",
        bgColor: "bg-red-600/10"
    },
    {
        name: "Departments",
        number: data?.departments,
        icon: <House />,
        color: "bg-purple-600/20 text-purple-400",
        bgColor: "bg-purple-600/10"
    },
];

// employee cards
export const getEmployeeStatsCard = (data) => [
    {
        name: "Total Employees",
        number: data?.totalEmployees,
        icon: <Users />,
        color: "bg-blue-600/20 text-blue-400",
        bgColor: "bg-blue-600/10"
    },
    {
        name: "Active Employees",
        number: data?.activeEmployees,
        icon: <CircleCheck />,
        color: "bg-green-600/20 text-green-400",
        bgColor: "bg-green-600/10"
    },
    {
        name: "Absent Employees",
        number: data?.absentEmployees,
        icon: <UserX />,
        color: "bg-red-600/20 text-red-400",
        bgColor: "bg-red-600/10"
    },
    {
        name: "Inactive Employees",
        number: data?.inactiveEmployees,
        icon: <Ban User />,
        color: "bg-amber-600/20 text-amber-400",
        bgColor: "bg-amber-600/10"
    }
]

// department cards
export const getDepartmentStatsCard = (data) => [
    {
        name: "Total Departments",
        number: data?.totalDepartments,
        icon: <House />,
        color: "bg-blue-600/20 text-blue-400",
        bgColor: "bg-blue-600/10"
    },
    {
        name: "Active Departments",
        number: data?.activeDepartments,
        icon: <CircleCheck />,
        color: "bg-green-600/20 text-green-400",
        bgColor: "bg-green-600/10"
    },
    {
        name: "Inactive Departments",
        number: data?.inactiveDepartments,
        icon: <Ban />,
        color: "bg-red-600/20 text-red-400",
        bgColor: "bg-red-600/10"
    },
]