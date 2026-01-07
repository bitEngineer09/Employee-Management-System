import { useQuery } from '@tanstack/react-query';
import { getDepartmentApi } from '../../../api/department.api';
const useGetDepartment = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["departments"],
        queryFn: async () => {
            const res = await getDepartmentApi();
            return res.data;
        },
        retry: false,
    });
    return {
        getDepartmentData: data,
        isLoading,
        error,
    };
};

export default useGetDepartment;