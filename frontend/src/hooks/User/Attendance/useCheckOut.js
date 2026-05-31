import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { checkOutApi } from "../../../api/attendance.api";


const useCheckOut = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: (payload) => checkOutApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["todayAttendance"]);
            toast.success("Checked-out successfully!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useCheckOut error", error?.response?.data || error);
        },
    });
    return {
        checkOut: mutate,
        isLoading: isPending,
        error,
    };
};

export default useCheckOut;