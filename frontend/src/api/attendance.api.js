import { axiosInstance } from "../lib/axios";

// check-in
export const checkInApi = () => {
    return axiosInstance.post("/employee/attendance/check-in");
};

// check-out
export const checkOutApi = () => {
    return axiosInstance.patch("/employee/attendance/check-out");
};

// get employee attendance by range
export const getEmpAttendanceApi = ({ from, to }) => {
    return axiosInstance.get("/employee/attendance", {
        params: {
            from,
            to
        },
    });
};

// get monthly attendance summary
export const getMonthlyAttendanceSummaryApi = ({ month }) => {
    return axiosInstance.get("/employee/attendance/summary", {
        params: {
            month,
        },
    });
};

// get today attendance data of employee
export const getTodayAttendanceApi = () => {
    return axiosInstance.get("/employee/attendance/today");
};