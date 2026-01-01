import { verifyingCode } from "@/app/services/verification"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

export const useVerifyCode = ({ setIsOpenVerificationForm }: { setIsOpenVerificationForm: Dispatch<SetStateAction<boolean>> }) => {
    const verifyCodeMutation = useMutation({
        mutationKey: ['verify_code'],
        mutationFn: verifyingCode,
        onSuccess: () => {
            alert("Verify Successfully")
            setIsOpenVerificationForm(false);
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
    return { verifyCodeMutation }
}