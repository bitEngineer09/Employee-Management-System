import { useQuery } from '@tanstack/react-query';
import { getHolidaysApi } from '../../../api/holiday.api';

const useGetHolidays = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["holidays"],
        queryFn: async () => {
            const res = await getHolidaysApi();
            return res.data;
        },
        retry: false,
    })
    return {
        holidays: data,
        isLoading,
        error,
    }
}

export default useGetHolidays;