import { useQuery } from "@tanstack/react-query";
import { getAllLeavesApi } from "../../../api/leave.api";

const useGetAllLeaves = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["leaves"],
        queryFn: async () => {
            const res = await getAllLeavesApi();
            return res?.data;
        }
    });
    return {
        leaves: data,
        isLoading,
        error,
    };
};

export default useGetAllLeaves;