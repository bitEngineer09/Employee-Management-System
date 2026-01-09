import { useQuery } from "@tanstack/react-query";
import { getMonthlyAttendanceSummary } from "../../api/attendance.api";

const useGetMohtlyAttendanceSummary = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["empMonthlyAttendance"],
        queryFn: async () => {
            const res = await getMonthlyAttendanceSummary();
            return res?.data;
        },
        retry: false,
    });
    return {
        getMonthlyEmpAttendance: data,
        isLoading,
        error,
    };
};

export default useGetMohtlyAttendanceSummary;