import { axiosInstance } from '../lib/axios';

// get payslip
export const getPaySlipApi = () => {
    return axiosInstance.get("/employee/payslip");
};

// get payslip pdf
export const getPaySlipPdfApi = () => {
    return axiosInstance.get("/employee/payslip/pdf");
};