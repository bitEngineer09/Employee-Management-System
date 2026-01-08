import { useQuery } from "@tanstack/react-query";
import { todayEmployeesAttendanceApi } from "../../api/admin.api";

const useTodayEmployeesAttendance = () => {
    const {data, isLoading, error} = useQuery({
        queryKey: ["todayEmployeesAttendance"],
        queryFn: async () => {
            const res = await todayEmployeesAttendanceApi();
            return res?.data;
        },
        retry: false,
    });
    return {
        todayEmployeesAttendance: data,
        isLoading,
        error,
    };
};

export default useTodayEmployeesAttendance;