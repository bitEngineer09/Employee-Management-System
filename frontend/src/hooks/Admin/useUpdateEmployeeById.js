import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployeeApi } from '../../api/admin.api';
import toast from 'react-hot-toast';

const useUpdateEmployeeById = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading, error } = useMutation({
        mutationFn: updateEmployeeApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["allEmployees"]);
            toast.success("Employee updated successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useCreateEmployee error", error?.response?.data || error);
        },
    });
    return {
        updateEmployee: mutate,
        isLoading,
        error,
    };
};

export default useUpdateEmployeeById;