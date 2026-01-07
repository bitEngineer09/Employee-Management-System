import { axiosInstance } from '../lib/axios.js';

// create holiday
export const createHolidayApi = (data) => {
    return axiosInstance.post("/admin/holiday", data);
};

// get holiday
export const getHolidaysApi = () => {
    return axiosInstance.get("/admin/holiday");
};

// delete holiday
export const deleteHolidayApi = (id) => {
    return axiosInstance.delete(`/admin/holiday/${id}`);
};