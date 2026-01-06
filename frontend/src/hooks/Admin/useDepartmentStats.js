import { useQuery } from "@tanstack/react-query";
import { departmentStatsApi } from "../../api/admin.api";

const useDepartmentStats = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["departmentStats"],
        queryFn: async () => {
            const res = await departmentStatsApi();
            return res.data;
        },
        retry: false,
    });
    return {
        departmentStats: data,
        isLoading,
        error,
    };
};

export default useDepartmentStats;