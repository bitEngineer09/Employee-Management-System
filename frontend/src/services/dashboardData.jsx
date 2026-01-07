import { IoIosPerson } from "react-icons/io";
import { PiHouseSimpleBold } from "react-icons/pi";
import { MdOutlineVerified } from "react-icons/md";

export const getStats = (data) => [
    {
        name: "Total Employees",
        number: data?.totalEmployees,
        icon: <IoIosPerson />,
        color: "bg-blue-600/20 text-blue-400",
        bgColor: "bg-blue-600/10"
    },
    {
        name: "Present Employees",
        number: data?.presentEmployees,
        icon: <MdOutlineVerified />,
        color: "bg-green-600/20 text-green-400",
        bgColor: "bg-green-600/10"
    },
    {
        name: "Absent Employees",
        number: data?.absentEmployees,
        icon: <IoIosPerson />,
        color: "bg-red-600/20 text-red-400",
        bgColor: "bg-red-600/10"
    },
    {
        name: "Departments",
        number: data?.departments,
        icon: <PiHouseSimpleBold />,
        color: "bg-purple-600/20 text-purple-400",
        bgColor: "bg-purple-600/10"
    },
];

export const getEmployeeChartData = (data) => [
    { name: "Total Employees", value: data?.totalEmployees },
    { name: "Present", value: data?.presentEmployees },
    { name: "Absent", value: data?.absentEmployees },
    { name: "Leave", value: data?.onLeaveEmployees },
];

export const getAttendancePieData = (data) => [
    { name: "Present", value: data?.presentEmployees },
    { name: "Absent", value: data?.absentEmployees },
    { name: "On Leave", value: data?.onLeaveEmployees },
];

export const getActiveInactivePieData = (data) => [
    { name: "Active", value: data?.activeEmployees },
    { name: "Inactive", value: data?.inactiveEmployees },
];