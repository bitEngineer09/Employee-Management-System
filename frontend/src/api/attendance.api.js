import { axiosInstance } from "../lib/axios";

// check-in (with face descriptor + location)
export const checkInApi = ({ faceDescriptor, lat, lng, deviceInfo }) => {
    return axiosInstance.post("/employee/attendance/check-in", {
        faceDescriptor,
        lat,
        lng,
        deviceInfo,
    });
};

// check-out (with location)
export const checkOutApi = ({ lat, lng, deviceInfo }) => {
    return axiosInstance.patch("/employee/attendance/check-out", {
        lat,
        lng,
        deviceInfo,
    });
};

// register face descriptor (called once during face enrollment)
export const registerFaceApi = (faceDescriptor) => {
    return axiosInstance.post("/employee/register-face", { faceDescriptor });
};

// get employee attendance by range
export const getEmpAttendanceApi = ({ from, to }) => {
    return axiosInstance.get("/employee/attendance", {
        params: { from, to },
    });
};

// get monthly attendance summary
export const getMonthlyAttendanceSummaryApi = ({ month }) => {
    return axiosInstance.get("/employee/attendance/summary", {
        params: { month },
    });
};

// get today attendance data of employee
export const getTodayAttendanceApi = () => {
    return axiosInstance.get("/employee/attendance/today");
};