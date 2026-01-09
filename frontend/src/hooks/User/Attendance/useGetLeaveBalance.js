import { useQuery } from "@tanstack/react-query";
import { getLeaveBalanceApi } from "../../api/leave.api";

const useGetLeaveBalance = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["leaveBalance"],
        queryFn: async () => {
            const res = await getLeaveBalanceApi();
            return res?.data;
        },
        retry: false,
    });
    return {
        getEmpAttendance: data,
        isLoading,
        error,
    };
};

export default useGetLeaveBalance;