import { useQuery } from '@tanstack/react-query';
import { getDepartmentByIdApi } from '../../../api/department.api';

const useGetDepartmentById = (id) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["department", id],
        queryFn: async () => await getDepartmentByIdApi(id),
        enabled: !!id,
        retry: false,
    });
    return {
        departmentDetail: data?.data,
        isLoading,
        error,
    };
};

export default useGetDepartmentById;