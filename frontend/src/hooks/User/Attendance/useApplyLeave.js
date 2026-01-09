import { useMutation } from "@tanstack/react-query";
import { applyLeaveApi } from "../../api/leave.api";
import toast from "react-hot-toast";

const useApplyLeave = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: applyLeaveApi,
        onSuccess: () => {
            toast.success("Leave applied successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useApplyLeave error", error?.response?.data || error);
        },
    });
    return {
        applyLeave: mutate,
        isLoading,
        error,
    };
};

export default useApplyLeave;