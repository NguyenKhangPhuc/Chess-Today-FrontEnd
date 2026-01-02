import { createVerificationCode } from "@/app/services/verification"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

export const useCreateVerificationCode = () => {
    const createVerificationCodeMutation = useMutation({
        mutationKey: ['create_verification_code'],
        mutationFn: createVerificationCode,
        onSuccess: () => {
            alert("Code sent, please check your email")
        },
        onError: (error) => {
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            alert(`Sign up failed: ${message}`);
        }
    })
    return { createVerificationCodeMutation }
}