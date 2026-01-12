import { axiosInstance } from '../lib/axios';

// get payslip
export const getPaySlipApi = (month) => {
    return axiosInstance.get("/employee/payslip", {
        params: {
            month,
        },
    });
};

// get payslip pdf
export const getPaySlipPdfApi = (month) => {
    return axiosInstance.get("/employee/payslip/pdf", {
        params: { month },
        responseType: "blob",
    });
};