import { axiosInstance } from "../lib/axios"

// get dashboard stats
export const adminDashboardApi = () => {
    return axiosInstance.get("/admin/admin-stats");
};

// create employee
export const createEmployeeApi = (data) => {
    return axiosInstance.post("/employee", data);
}

// get all employees
export const getAllEmployeesApi = () => {
    return axiosInstance.get("/employees");
}

// get employee by id
export const getEmployeeByIdApi = (id) => {
    return axiosInstance.get(`/employee/${id}`);
}

// update employee
export const updateEmployeeApi = (id, data) => {
    return axiosInstance.put(`/employee/${id}`, data);
}

// update employee status
export const updateEmployeeStatusApi = (id, data) => {
    return axiosInstance.patch(`/employee/${id}/status`, data)
}