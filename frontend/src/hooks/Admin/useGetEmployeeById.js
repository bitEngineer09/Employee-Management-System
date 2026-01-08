import {useQuery} from '@tanstack/react-query';
import { getEmployeeByIdApi } from '../../api/admin.api';

const useGetEmployeeById = (id) => {
    const {data, isLoading, error} = useQuery({
        queryKey: ["employee", id],
        queryFn: async () => await getEmployeeByIdApi(id),
        enabled: !!id,
        retry: false,
    });
    return {
        employeeById: data?.data,
        isLoading,
        error,
    };
};

export default useGetEmployeeById;