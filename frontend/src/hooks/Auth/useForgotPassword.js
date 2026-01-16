import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { forgotPasswordApi } from '../../api/auth.api';


const useForgotPassword = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: () => {
            toast.success("OTP sent successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useForgotPassword error", error?.response?.data || error);
        },
    });
    return {
        forgotPassword: mutate,
        isLoading,
        error,
    };
};

export default useForgotPassword;