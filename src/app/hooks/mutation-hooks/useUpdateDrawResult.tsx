import { useNotification } from "@/app/contexts/NotificationContext";
import { updateGameDrawResult } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

// Custom hook to update the result
export const useUpdateDrawResult = () => {
    const { showNotification } = useNotification();
    const updateDrawResultMutation = useMutation({
        mutationKey: ['update_draw_result'],
        mutationFn: updateGameDrawResult,
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
    return { updateDrawResultMutation }
}