import { useQuery } from '@tanstack/react-query';
import { getPaySlipPdfApi } from '../../../api/payslip.api';

const useGeneratePayslipPdf = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["paySlip"],
        queryFn: async () => {
            const res = await getPaySlipPdfApi();
            return res?.data;
        }
    });
    return {
        generatePayslipPdf: data,
        isLoading,
        error,
    };
};

export default useGeneratePayslipPdf;