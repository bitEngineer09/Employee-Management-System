import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from "../../api/auth.api.js";
import toast from 'react-hot-toast';

const useLogout = () => {

    const queryClient = useQueryClient();

    const { mutate, isLoading, error } = useMutation({
        mutationFn: logoutApi,
        onSuccess: async () => {
            toast.success("logout success");
            queryClient.removeQueries(["authUser"])
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useLogout error", error?.response?.data || error);
        },
    });
    return {
        logout: mutate,
        isLoading,
        error,
    };
};

export default useLogout;