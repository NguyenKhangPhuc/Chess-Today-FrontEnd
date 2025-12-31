import { setTokenToHeader } from "@/app/libs/api";
import { getSocket } from "@/app/libs/sockets";
import { login } from "@/app/services/credentials";
import { ChallengeAttributes } from "@/app/types/challenge";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Custom hook for create the mutation for login
export const useLogin = ({ router, queryClient }: { router: AppRouterInstance, queryClient: QueryClient }) => {
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(data)
            router.replace('/game-management')
            queryClient.invalidateQueries({ queryKey: ['authenticate'] });
        },
        onError: (error) => {
            console.log(error)
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            alert(`Sign up failed: ${message}`);
        }
    })
    return { loginMutation }
}
