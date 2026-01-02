import { updateUserPassword } from "@/app/services/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useUpdatePassword = ({ router }: { router: AppRouterInstance }) => {
    const updatePasswordMutation = useMutation({
        mutationKey: ['update_password'],
        mutationFn: updateUserPassword,
        onSuccess: () => {
            alert('Update user password successfully')
            router.push('/login');
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
    return { updatePasswordMutation }
}