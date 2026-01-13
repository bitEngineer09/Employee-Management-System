import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveRejectLeaveApi } from "../../../api/leave.api";
import toast from "react-hot-toast";

const useApproveRejectLeave = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading, error } = useMutation({
        mutationFn: approveRejectLeaveApi,
        onSuccess: () => {
            toast.success("Leave status updated");
            queryClient.invalidateQueries(["leaves"]);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useApproveRejectLeave error", error?.response?.data || error);
        },
    });
    return {
        approveRejectLeave: mutate,
        isLoading,
        error,
    };
};

export default useApproveRejectLeave;