import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteHolidayApi } from '../../../api/holiday.api';

const useDeleteHoliday = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: deleteHolidayApi,
        onSuccess: () => {
            toast.success("Holiday deleted");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useDeleteHoliday error", error?.response?.data || error);
        },
    });
    return {
        deleteHoliday: mutate,
        isLoading,
        error,
    }
};

export default useDeleteHoliday;