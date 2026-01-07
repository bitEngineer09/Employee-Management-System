import { useQuery } from '@tanstack/react-query';
import { getDepartmentByIdApi } from '../../../api/department.api';

const useGetDepartmentById = (id) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["department", id],
        queryFn: getDepartmentByIdApi,
        retry: false,
    });
    return {
        data,
        isLoading,
        error,
    };
};

export default useGetDepartmentById;