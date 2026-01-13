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
};

// get all leaves (ADMIN)
export const getAllLeavesApi = () => {
    return axiosInstance.get("/admin/leaves");
};

// approve / reject leave (ADMIN)
export const approveRejectLeaveApi = ({ id, status }) => {
    return axiosInstance.patch(`/admin/leaves/${id}`, { status });
};
