import { axiosInstance } from "../lib/axios";

// apply leave
export const applyLeaveApi = (data) => {
    return axiosInstance.post("/employee/leave", data);
};

// get leave balance
export const getLeaveBalanceApi = () => {
    return axiosInstance.get("/employee/leave-balance");
};

// get active leave
export const getActiveLeave = () => {
    return axiosInstance.get("/employee/active-leave");
}