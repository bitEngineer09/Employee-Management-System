import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createHolidayApi } from '../../../api/holiday.api';

const useCreateHoliday = () => {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: createHolidayApi,
        onSuccess: () => {
            toast.success("Holiday created");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useCreateHoliday error", error?.response?.data || error);
        },
    });
    return {
        createHoliday: mutate,
        isLoading,
        error,
    }
};

export default useCreateHoliday;