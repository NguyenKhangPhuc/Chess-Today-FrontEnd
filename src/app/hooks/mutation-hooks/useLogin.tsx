import { useNotification } from "@/app/contexts/NotificationContext";
import { setTokenToHeader } from "@/app/libs/api";
import { getSocket } from "@/app/libs/sockets";
import { login } from "@/app/services/credentials";
import { ChallengeAttributes } from "@/app/types/challenge";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

// Custom hook for create the mutation for login
export const useLogin = ({ router, queryClient, setIsVerified }: { router: AppRouterInstance, queryClient: QueryClient, setIsVerified: Dispatch<SetStateAction<boolean>> }) => {
    const { showNotification } = useNotification();
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            showNotification('Login successfully');
            router.push('/game-management')
            queryClient.invalidateQueries({ queryKey: ['authenticate'] });
        },
        onError: (error) => {
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
                if (error.response?.data.errorCode == 'UNVERIFIED') {
                    setIsVerified(true);
                }
            } else if (error instanceof Error) {
                message = error.message;
            }
            showNotification(message)
        }
    })
    return { loginMutation }
}
