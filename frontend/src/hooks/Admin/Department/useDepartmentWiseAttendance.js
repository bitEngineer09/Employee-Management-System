import { useQuery } from "@tanstack/react-query"
import { departmentWiseAttendanceApi } from "../../../api/department.api";


const useDepartmentWiseAttendance = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["departmentWiseAttendance"],
        queryFn: async () => {
            const res = await departmentWiseAttendanceApi();
            return res.data;
        },
    });
    return {
        departmentWiseAttendance: data,
        isLoading,
        error,
    };
};

export default useDepartmentWiseAttendance;