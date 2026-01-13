import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateDepartmentApi } from '../../../api/department.api';
import toast from 'react-hot-toast';

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading, error } = useMutation({
        mutationFn: deactivateDepartmentApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["departments"]);
            toast.success("Department deactivated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useDeleteDepartment error", error?.response?.data || error);
        },
    });
    return {
        deactivateDepartment: mutate,
        isLoading,
        error,
    };
};

export default useDeleteDepartment;