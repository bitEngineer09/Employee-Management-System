import { axiosInstance } from "../lib/axios"

export const loginApi = (data) => {
    return axiosInstance.post("/auth/login", data);
};

export const signupApi = (data) => {
    return axiosInstance.post("/auth/signup", data);
};

export const logoutApi = () => {
    return axiosInstance.post("/auth/logout");
};

export const userInfoApi = () => {
    return axiosInstance.get("/auth/me");
};

export const changeDefaultPasswordApi = (data) => {
    return axiosInstance.patch("/employee/change-password", data);
};

export const forgotPasswordApi = (data) => {
    return axiosInstance.post("/auth/forgot-password", data);
};

export const resetPasswordApi = (data) => {
    return axiosInstance.post("/auth/reset-password", data);
};