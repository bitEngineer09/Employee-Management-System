import { useQuery } from "@tanstack/react-query";
import { getEmpAttendanceApi } from "../../../api/attendance.api";

const useGetEmpAttendance = (from, to) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["empAttendance", from, to],
        queryFn: async () => {
            const res = await getEmpAttendanceApi({ from, to });
            return res?.data;
        },
        enabled: false,
        retry: false,
    });

    return {
        getEmpAttendance: data,
        isLoading,
        error,
        fetchAttendance: refetch,
    };
};

export default useGetEmpAttendance;
