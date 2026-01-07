import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartmentApi } from '../../../api/department.api';
import toast from 'react-hot-toast';
const useCreateDepartment = () => {
    const queryClient = useQueryClient();

    const { mutate, isLoading, error } = useMutation({
        mutationFn: createDepartmentApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["departments"]);
            toast.success("Department created");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("createDepartment error", error?.response?.data || error);
        },
    });
    return {
        createDepartment: mutate,
        isLoading,
        error,
    };
};

export default useCreateDepartment;