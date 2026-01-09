import { useQuery } from '@tanstack/react-query';
import { getTodayAttendanceApi } from '../../../api/attendance.api';

const useGetTodayAttendance = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["todayAttendance"],
        queryFn: async () => {
            const res = await getTodayAttendanceApi();
            return res?.data;
        },
        retry: false,
    });
    return {
        todayAttendance: data,
        isLoading,
        error,
    };
};

export default useGetTodayAttendance;