import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartmentApi } from "../../../api/department.api";
import toast from "react-hot-toast";

const useUpdateDepartment = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isLoading, error } = useMutation({
        mutationFn: updateDepartmentApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["departments"])
            toast.success("Department updated successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("updateDepartment error", error?.response?.data || error);
        },
    });
    return {
        updateDepartment: mutate,
        isLoading,
        error,
    };
};

export default useUpdateDepartment;