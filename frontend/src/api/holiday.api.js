import { axiosInstance } from '../lib/axios.js';

// create holiday
export const createHolidayApi = (data) => {
    return axiosInstance.post("/admin/holidays", data);
};

// get holiday
export const getHolidaysApi = () => {
    return axiosInstance.get("/admin/holidays");
};

// delete holiday
export const deleteHolidayApi = (id) => {
    return axiosInstance.delete(`/admin/holidays/${id}`);
};