import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { resetPasswordApi } from '../../api/auth.api';


const useResetPassword = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: () => {
            toast.success("Password reset successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || error?.response?.data?.errors[0]?.message || "Something went wrong");
            console.error("useChangeDefaultPassword error", error?.response?.data?.errors[0]?.message);
        },
    });
    return {
        resetPassword: mutate,
        isLoading,
        error,
    };
};

export default useResetPassword;