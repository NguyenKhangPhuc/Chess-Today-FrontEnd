import { useNotification } from "@/app/contexts/NotificationContext"
import { updateGameFen } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

// Custom hook to update the game fen
export const useUpdateGameFen = (gameId: string) => {
    const { showNotification } = useNotification();
    const updateGameFenMutation = useMutation({
        mutationKey: [`update_game_${gameId}`],
        mutationFn: updateGameFen,
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
    return { updateGameFenMutation }
}