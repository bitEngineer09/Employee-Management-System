import { useQuery } from "@tanstack/react-query";
import { searchEmployees } from "../../api/admin.api";

export const useSearchEmployees = (query) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["searchEmployees", query],
        queryFn: async () => {
            const res = await searchEmployees(query)
            return res.data.data;
        },
        enabled: !!query,
    });
    return {
        employeeSearchData: data,
        isLoading,
        error,
    }
};
