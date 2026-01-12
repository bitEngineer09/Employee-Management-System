import { useMutation } from '@tanstack/react-query';
import { getPaySlipPdfApi } from '../../../api/payslip.api';
import toast from "react-hot-toast";

const useGeneratePayslipPdf = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: async (month) => {
            const res = await getPaySlipPdfApi(month);
            return res.data;
        },
        onSuccess: (blob, month) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `payslip-${month}.pdf`;
            a.click();
            URL.revokeObjectURL(url); // cleanup
            toast.success("Payslip downloaded");
        },
        onError: () => {
            console.error("useGeneratePayslipPdf error", error?.response?.data || error);
            toast.error(error?.response?.data?.message || "Failed to download payslip");
        }
    });

    return {
        downloadPayslip: mutate,
        isLoading,
        error,
    };
};

export default useGeneratePayslipPdf;
