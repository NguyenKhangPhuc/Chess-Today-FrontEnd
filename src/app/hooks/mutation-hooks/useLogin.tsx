import { login } from "@/app/services/credentials";
import { useMutation } from "@tanstack/react-query";

export const useLogin = ({ setToken }: { setToken: (token: string) => void }) => {
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            window.localStorage.setItem('userToken', data.token);
            setToken(data.token);
        },
    })
    return { loginMutation }
}
