import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { signupApi } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';

const useSignup = () => {
    const navigate = useNavigate()
    const { mutate, isLoading, error } = useMutation({
        mutationFn: signupApi,
        onSuccess: () => {
            toast.success("Signup success");
            navigate("/auth");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("useLogin error", error?.response?.data || error);
        },
    });
    return {
        signup: mutate,
        isLoading,
        error,
    };
};

export default useSignup;