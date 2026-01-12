import { useQuery } from '@tanstack/react-query';
import { getPaySlipApi } from '../../../api/payslip.api';

const useGetPaySlip = (month) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["paySlip", month],
        queryFn: async () => {
            if (!month) return null;
            const res = await getPaySlipApi(month);
            return res?.data?.payslip;
        },
        enabled: !!month,
        retry: false,
    });

    return {
        payslip: data,
        isLoading,
        error,
    };
};

export default useGetPaySlip;
