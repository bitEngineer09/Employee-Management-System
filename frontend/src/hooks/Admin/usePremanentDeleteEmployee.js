import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { permanentDeleteEmployeeApi } from "../../api/admin.api";

const usePermanentDeleteEmployee = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading, error } = useMutation({
        mutationFn: permanentDeleteEmployeeApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["allEmployees"]);
            queryClient.invalidateQueries(["allEmployee"]);
            toast.success("Employee deleted");
        },
        onError: () => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("usePermanentDeleteEmployee error", error?.response?.data || error);
        },
    });
    return {
        permanentDeleteEmployee: mutate,
        isLoading,
        error,
    };
};

export default usePermanentDeleteEmployee;