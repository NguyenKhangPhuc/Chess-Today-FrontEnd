import { setTokenToHeader } from "@/app/libs/api";
import { getSocket } from "@/app/libs/sockets";
import { login } from "@/app/services/credentials";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useMutation } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useLogin = ({ setToken, router }: { setToken: (token: string) => void, router: AppRouterInstance }) => {
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            window.localStorage.setItem('userToken', data.token);
            setToken(data.token);
            setTokenToHeader();
        },
    })
    return { loginMutation }
}
