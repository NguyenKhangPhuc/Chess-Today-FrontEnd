import { signUp } from "@/app/services/credentials";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
// Custom hook to create the sign up mutation
export const useSignUp = ({ setIsOpenVerificationForm }: { setIsOpenVerificationForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const signUpMutation = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            setIsOpenVerificationForm(true);
        },
        onError: (error) => {
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            alert(`Sign up failed: ${message}`);
        },

    })
    return { signUpMutation }
}