import { axiosInstance } from "../lib/axios"

// get payroll 
export const getPayrollApi = ({ employeeId, month }) => {
    return axiosInstance.get("/admin/payroll", {
        params: {
            employeeId,
            month,
        },
    });
};

// generate payroll 
export const generatePayrollApi = (data) => {
    return axiosInstance.post("/admin/payroll/generate", data);
};

// regenerate payroll
export const regeneratePayrollApi = (data) => {
    return axiosInstance.post("/admin/payroll/regenerate", data);
};