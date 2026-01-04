import { useNotification } from "@/app/contexts/NotificationContext";
import { updateUserPassword } from "@/app/services/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useUpdatePassword = ({ router }: { router: AppRouterInstance }) => {
    const { showNotification } = useNotification();
    const updatePasswordMutation = useMutation({
        mutationKey: ['update_password'],
        mutationFn: updateUserPassword,
        onSuccess: () => {
            showNotification('Update user password successfully');
            router.push('/login');
        },
        onError: (error) => {
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            showNotification(message);
        }
    })
    return { updatePasswordMutation }
}