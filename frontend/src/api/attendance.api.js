import { axiosInstance } from "../lib/axios";

// check-in
export const checkInApi = () => {
    return axiosInstance.post("/employee/attendance/check-in");
};

// check-out
export const checkOutApi = () => {
    return axiosInstance.patch("/employee/attendance/check-out");
};

// get employee attendance
export const getEmpAttendanceApi = ({ from, to }) => {
    return axiosInstance.get("/employee/attendance", {
        params: {
            from,
            to
        },
    });
};

// get monthly attendance summary
export const getMonthlyAttendanceSummary = () => {
    return axiosInstance.get("/employee/attendance/summary");
}