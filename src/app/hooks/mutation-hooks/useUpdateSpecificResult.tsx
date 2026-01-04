import { useNotification } from "@/app/contexts/NotificationContext"
import { updateGameSpecificResult } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

// Custom hook to update the specific result
export const useUpdateSpecificResult = () => {
    const { showNotification } = useNotification();
    const updateSpecificResultMutation = useMutation({
        mutationKey: ['update_specific_result'],
        mutationFn: updateGameSpecificResult,
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
    return { updateSpecificResultMutation }
}