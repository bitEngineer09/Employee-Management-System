import { axiosInstance } from "../lib/axios"

// get dashboard stats
export const adminDashboardApi = () => {
    return axiosInstance.get("/admin/admin-stats");
};

// create employee
export const createEmployeeApi = (data) => {
    return axiosInstance.post("/admin/employee", data);
}

// get all employees
export const getAllEmployeesApi = () => {
    return axiosInstance.get("/admin/employees");
}

// get employee by id
export const getEmployeeByIdApi = (id) => {
    return axiosInstance.get(`/admin/employee/${id}`);
}

// update employee
export const updateEmployeeApi = (id, data) => {
    return axiosInstance.put(`/admin/employee/${id}`, data);
}

// update employee status
export const updateEmployeeStatusApi = (id, data) => {
    return axiosInstance.patch(`/admin/employee/${id}/status`, data)
}