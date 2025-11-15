import { setTokenToHeader } from "@/app/libs/api";
import { getSocket } from "@/app/libs/sockets";
import { login } from "@/app/services/credentials";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useMutation } from "@tanstack/react-query";

export const useLogin = ({ setToken }: { setToken: (token: string) => void }) => {
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            window.localStorage.setItem('userToken', data.token);
            setToken(data.token);
            setTokenToHeader();
            const socket = getSocket();
            socket.on('new_challenge', (challenge) => {
                alert('New Challenge receive')
            })
        },
    })
    return { loginMutation }
}
