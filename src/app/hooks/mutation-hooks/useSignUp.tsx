import { signUp } from "@/app/services/credentials";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = ({ setIsLogin }: { setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const signUpMutation = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            setIsLogin(true);
        }
    })
    return { signUpMutation }
}