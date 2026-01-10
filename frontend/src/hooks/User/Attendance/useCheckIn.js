import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { checkInApi } from '../../../api/attendance.api'

const useCheckIn = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading, error } = useMutation({
        mutationFn: checkInApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["todayAttendance"]);
            toast.success("Checked-in success");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useCheckIn error", error?.response?.data || error);
        },
    });
    return {
        checkIn: mutate,
        isLoading,
        error,
    };
};

export default useCheckIn;