import { useQuery } from '@tanstack/react-query';
import { userInfoApi } from '../../api/auth.api';

const useUser = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await userInfoApi();
            return res.data;
        },
        retry: false,
    });
    return {
        currentUser: data,
        isLoading,
        error,
        isAuthenticated: !!data,
    };
};


export default useUser;