import { useMutation } from '@tanstack/react-query';
import { createEmployeeApi } from '../../api/admin.api.js';
import toast from 'react-hot-toast';

const useCreateEmployee = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: createEmployeeApi,
        onSuccess: () => {
            toast.success("Employee created");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useCreateEmployee error", error?.response?.data || error);
        },
    });
    return {
        createEmployee: mutate,
        isLoading,
        error,
    }
};

export default useCreateEmployee;