import { axiosInstance } from "../lib/axios"

// get payroll 
export const getPayroll = ({ employeeId, month }) => {
    return axiosInstance.get("/admin/payroll", {
        params: {
            employeeId,
            month,
        },
    });
};

// generate payroll 
export const generatePayroll = (data) => {
    return axiosInstance.post("/admin/payroll/generate", data);
};

// regenerate payroll
export const regeneratePayroll = (data) => {
    return axiosInstance.post("/admin/payroll/regenerate", data);
};