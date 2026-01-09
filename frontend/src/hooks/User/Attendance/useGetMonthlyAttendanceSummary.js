import { useQuery } from "@tanstack/react-query";
import { getMonthlyAttendanceSummaryApi } from "../../../api/attendance.api";


const useGetMohtlyAttendanceSummary = (month) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["empMonthlyAttendanceSummary", month],
        queryFn: async () => {
            const res = await getMonthlyAttendanceSummaryApi({month});
            return res?.data;
        },
        enabled: !!month,
        retry: false,
    });
    return {
        getMonthlyEmpAttendance: data,
        isLoading,
        error,
    };
};

export default useGetMohtlyAttendanceSummary;