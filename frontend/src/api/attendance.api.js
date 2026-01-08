import {axiosInstance} from "../lib/axios";

// check-in
export const checkInApi = () => {
    return axiosInstance.post("/employee/attendance/check-in");
};

// check-out
export const checkOutApi = () => {
    return axiosInstance.patch("/employee/attendance/check-out");
};