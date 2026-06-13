import { useQuery } from "@tanstack/react-query";
import { departmentAttendanceSummaryApi } from "../../../api/admin.api";

const useDepartmentAttendanceSummary = (departmentId, from, to, enabled = true) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["departmentAttendanceSummary", departmentId, from, to],
        queryFn: async () => {
            const res = await departmentAttendanceSummaryApi(departmentId, from, to);
            return res.data;
        },
        enabled: enabled && !!departmentId && !!from && !!to,
        retry: false,
    });

    return {
        departmentAttendanceSummary: data,
        isLoading,
        error,
    };
};

export default useDepartmentAttendanceSummary;