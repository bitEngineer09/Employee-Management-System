import { useQuery } from "@tanstack/react-query";
import { monthlyEmployeeAttendanceApi } from "../../../api/admin.api";

const useMonthlyEmployeeAttendance = (employeeId, month, enabled = true) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["employeeAttendance", employeeId, month],
        queryFn: async () => {
            const res = await monthlyEmployeeAttendanceApi(employeeId, month);
            return res.data;
        },
        enabled: enabled && !!employeeId && !!month,
        retry: false,
    });
    return {
        employeeAttendance: data,
        isLoading,
        error,
    }
}

export default useMonthlyEmployeeAttendance;