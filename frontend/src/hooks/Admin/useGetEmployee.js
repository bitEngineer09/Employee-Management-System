import { useQuery } from '@tanstack/react-query';
import { getAllEmployeesApi } from '../../api/admin.api';

const useGetEmployee = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["allEmployees"],
        queryFn: async () => {
            const res = await getAllEmployeesApi();
            return res.data;
        },
        retry: false,
    })
    return {
        allEmployeeData: data,
        isLoading,
        error,
    }
}

export default useGetEmployee;