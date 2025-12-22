import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '../../api/admin.api';

const useAdminDashboard = (enabled) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["adminDashboardStats"],
        queryFn: async() => {
            const res = await adminDashboardApi();
            return res.data;
        },
        enabled,
        retry: false,
    })

    return {
        adminDashboardData: data,
        isLoading,
        error,
    };
};

export default useAdminDashboard;