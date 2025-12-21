import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '../../api/admin.api';

const useAdminDashboard = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["adminDashboardStats"],
        queryFn: async() => {
            const res = await adminDashboardApi();
            return res.data;
        },
    })

    return {
        adminDashboardData: data,
        isLoading,
        error,
    };
};

export default useAdminDashboard;