import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { checkInApi } from '../../../api/attendance.api'

const useCheckIn = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: (payload) => checkInApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["todayAttendance"]);
            toast.success("Checked-in successfully!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useCheckIn error", error?.response?.data || error);
        },
    });
    return {
        checkIn: mutate,
        isLoading: isPending,
        error,
    };
};

export default useCheckIn;