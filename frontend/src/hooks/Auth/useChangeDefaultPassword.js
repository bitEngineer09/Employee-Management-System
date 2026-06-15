import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { changeDefaultPasswordApi } from '../../api/auth.api';

const useChangeDefaultPassword = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: changeDefaultPasswordApi,
        onSuccess: () => {
            toast.success("Password changed successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.errors[0]?.message || "Something went wrong");
            console.error("useChangeDefaultPassword error", error);
        },
    });
    return {
        changeDefaultPassword: mutate,
        isLoading,
        error,
    }
};

export default useChangeDefaultPassword;