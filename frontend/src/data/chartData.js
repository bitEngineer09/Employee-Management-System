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