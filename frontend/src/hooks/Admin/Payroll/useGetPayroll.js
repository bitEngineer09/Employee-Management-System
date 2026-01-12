import { useQuery } from '@tanstack/react-query';
import { getPayrollApi } from '../../../api/payroll.api';

const useGetPayroll = (employeeId, month) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["payroll", employeeId, month],
        queryFn: async () => {
            const res = await getPayrollApi({ employeeId, month });
            return res?.data;
        },
        enabled: false,
        retry: false,
    });
    return {
        getPayroll: data,
        isLoading,
        error,
        fetchPayroll: refetch,
    }
}

export default useGetPayroll;