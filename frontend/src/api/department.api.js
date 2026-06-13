import { axiosInstance } from "../lib/axios";

// get department stats
export const departmentStatsApi = () => {
    return axiosInstance.get("/department/admin-dept-stats");
};

// create department
export const createDepartmentApi = (data) => {
    return axiosInstance.post("/department", data);
};

// get all department
export const getDepartmentApi = () => {
    return axiosInstance.get("/department");
};

// get department by id
export const getDepartmentByIdApi = (id) => {
    return axiosInstance.get(`/department/${id}`)
};

// update department
export const updateDepartmentApi = ({id, data}) => {
    return axiosInstance.patch(`/department/${id}`, data);
};

// deactive department
export const deactivateDepartmentApi = (id) => {
    return axiosInstance.delete(`/department/${id}`);
};

// get department wise attendance summary
export const departmentWiseAttendanceApi = () => {
    return axiosInstance.get("/department/attendance");
};
