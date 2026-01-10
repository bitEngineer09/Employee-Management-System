import { useQuery } from '@tanstack/react-query';
import { getPaySlipApi } from '../../../api/payslip.api';

const useGetPaySlip = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["paySlip"],
        queryFn: async () => {
            const res = await getPaySlipApi();
            return res?.data;
        }
    });
    return {
        getPaySlip: data,
        isLoading,
        error,
    };
};

export default useGetPaySlip;