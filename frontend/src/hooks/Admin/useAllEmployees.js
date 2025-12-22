import { useQuery } from '@tanstack/react-query';
import { getAllEmployeesApi } from '../../api/admin.api';

const useAllEmployees = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["allEmployee"],
        queryFn: async () => {
            const res = await getAllEmployeesApi();
            return res.data;
        },
    });
    return {
        allEmployees: data,
        isLoading,
        error,
    }
}

export default useAllEmployees;