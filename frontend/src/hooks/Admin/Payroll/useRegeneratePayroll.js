import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { regeneratePayrollApi } from '../../../api/payroll.api.js';

const useRegeneratePayroll = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: regeneratePayrollApi,
        onSuccess: () => {
            toast.success("Payroll regenerated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useRegeneratePayroll.js error", error?.response?.data || error);
        },
    });
    return {
        regeneratePayroll: mutate,
        isLoading,
        error,
    }
};

export default useRegeneratePayroll;