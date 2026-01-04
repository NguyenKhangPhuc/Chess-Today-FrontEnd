import { useNotification } from "@/app/contexts/NotificationContext";
import { checkOngoingGame } from "@/app/services/game";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Custom hook to create a mutation for checking users' ongoing game
export const useCheckOngoingGame = () => {
    const { showNotification } = useNotification();
    const checkOngoingGameMutation = useMutation({
        mutationKey: ['check_ongoing_game'],
        mutationFn: checkOngoingGame,
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
    return { checkOngoingGameMutation }
}