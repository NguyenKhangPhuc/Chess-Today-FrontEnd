import { setTokenToHeader } from "@/app/libs/api";
import { getSocket } from "@/app/libs/sockets";
import { login } from "@/app/services/credentials";
import { ChallengeAttributes } from "@/app/types/challenge";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useLogin = ({ router, queryClient }: { router: AppRouterInstance, queryClient: QueryClient }) => {
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(data)
            router.replace('/game-management')
            queryClient.invalidateQueries({ queryKey: ['authenticate'] });
        },
    })
    return { loginMutation }
}
