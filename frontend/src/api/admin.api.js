import { axiosInstance } from "../lib/axios"

// get dashboard stats
export const adminDashboardApi = () => {
    return axiosInstance.get("/admin/stats");
};

// create employee
export const createEmployeeApi = (data) => {
    return axiosInstance.post("/admin/employee", data);
};

// get all employees
export const getAllEmployeesApi = () => {
    return axiosInstance.get("/admin/employee");
};

// get employee by id
export const getEmployeeByIdApi = (id) => {
    return axiosInstance.get(`/admin/employee/${id}`);
};

// update employee
export const updateEmployeeApi = ({id, data}) => {
    return axiosInstance.put(`/admin/employee/${id}`, data);
};

// update employee status ----------
export const updateEmployeeStatusApi = (id, data) => {
    return axiosInstance.patch(`/admin/employee/${id}/status`, data)
};

// today employees attendance ------------
export const todayEmployeesAttendanceApi = () => {
    return axiosInstance.get("/admin/attendance/today-employees");
};

// employee attendace summary for month
export const monthlyEmployeeAttendanceApi = (employeeId, month) => {
    return axiosInstance.get("/admin/attendance/employee-summary", {
        params: {
            employeeId,
            month,
        }
    });
};

// department attendance summary
export const departmentAttendanceSummaryApi = (departmentId, from, to) => {
    return axiosInstance.get(`/admin/attendance/department-summary/${departmentId}`,{
            params: {
                from,
                to,
            },
        });
};

// deactivate Employee 
export const deactivateEmployeeApi = (id) => {
    return axiosInstance.patch(`/admin/employee/${id}`);
};

// permanently delete employee
export const permanentDeleteEmployeeApi = (id) => {
    return axiosInstance.delete(`/admin/employee/${id}`);
};

// search employee
export const searchEmployees = (query) => {
    return axiosInstance.get(`/admin/employees/search`, {
        params: { query }
    });
}
