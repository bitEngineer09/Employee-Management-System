import { useQuery } from "@tanstack/react-query";
import { getActiveLeave } from "../../../api/leave.api";

const useGetActiveLeave = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["activeLeaves"],
        queryFn: async () => {
            const res = await getActiveLeave();
            return res?.data;
        },
        retry: false,
    });
    return {
        getActiveLeave: data,
        isLoading,
        error,
    };
};

export default useGetActiveLeave;