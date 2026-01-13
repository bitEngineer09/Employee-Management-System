import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateEmployeeApi } from "../../api/admin.api";
import toast from "react-hot-toast";

const useDeactivateEmployee = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading, error } = useMutation({
        mutationFn: deactivateEmployeeApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["allEmployees"]);
            queryClient.invalidateQueries(["allEmployee"]);
            toast.success("Employee deactivated");
        },
        onError: () => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useDeactivateEmployee error", error?.response?.data || error);
        },
    });
    return {
        deactivateEmployee: mutate,
        isLoading,
        error,
    };
};

export default useDeactivateEmployee;