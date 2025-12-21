import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../../api/auth.api";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isLoading, error } = useMutation({
        mutationFn: loginApi,
        onSuccess: async () => {
            toast.success("Login successfull");
            await queryClient.invalidateQueries(["authUser"]);
            navigate('/');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useLogin error", error?.response?.data || error);
        },
    });
    return {
        login: mutate,
        isLoading,
        error
    }
};

export default useLogin;