import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { signupApi } from '../api/auth.api';


const useSignup = () => {
    const {mutate, isLoading, error} = useMutation({
        mutationFn: signupApi,
        onSuccess: () => {
            toast.success("Signup successfull");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useSignup error", error);
        },
    });

    return {
        signup: mutate,
        isLoading,
        error,    
    };
};

export default useSignup;