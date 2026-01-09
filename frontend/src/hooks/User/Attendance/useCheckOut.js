import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { checkOutApi } from "../../../api/attendance.api";


const useCheckOut = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: checkOutApi,
        onSuccess: () => {
            toast.success("Checked-out success");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useCheckOut error", error?.response?.data || error);
        },
    });
    return {
        checkOut: mutate,
        isLoading,
        error,
    };
};

export default useCheckOut;