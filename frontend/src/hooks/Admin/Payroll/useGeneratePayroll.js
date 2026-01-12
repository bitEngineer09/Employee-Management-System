import { useMutation } from "@tanstack/react-query";
import { generatePayrollApi } from "../../../api/payroll.api";
import toast from "react-hot-toast";

const useGeneratePayroll = () => {
    const { mutate, data, isLoading, error } = useMutation({
        mutationFn: async (payload) => {
            const res = await generatePayrollApi(payload);
            return res?.data;
        },
        onSuccess: () => {
            toast.success("Payroll generated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    return {
        generatePayroll: mutate,
        generatePayrollData: data,
        isLoading,
        error,
    };
};

export default useGeneratePayroll;
