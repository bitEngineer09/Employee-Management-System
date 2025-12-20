import { axiosInstance } from "../lib/axios"

export const loginApi = (data) => {
    return axiosInstance.post("/auth/login", data);
};

export const signupApi = (data) => {
    return axiosInstance.post("/auth/signup", data);
};