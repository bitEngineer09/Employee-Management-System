import { useQuery } from '@tanstack/react-query';
import { getPayroll } from '../../../api/payroll.api';

const useGetPayroll = (employeeId, month) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["payroll", employeeId, month],
        queryFn: async () => {
            const res = await getPayroll({ employeeId, month });
            return res.data;
        },
        retry: false,
    });
    return {
        allEmployees: data,
        isLoading,
        error,
    }
}

export default useGetPayroll;