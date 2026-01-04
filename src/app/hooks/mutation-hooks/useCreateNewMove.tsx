import { useNotification } from "@/app/contexts/NotificationContext";
import { createNewGameMoves } from "@/app/services/move";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Socket } from "socket.io-client";

// Custom hook to create a mutation for making a new move
export const useCreateNewMove = ({ gameId, socket, opponentId, queryClient }: { gameId: string, socket: Socket | null, opponentId: string | null, queryClient: QueryClient }) => {
    const { showNotification } = useNotification();
    const createNewMoveMutation = useMutation({
        mutationKey: ['create_new_move'],
        mutationFn: createNewGameMoves,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [`moves_game_${gameId}`] })
            if (socket && opponentId) {
                socket.emit('new_move_history', opponentId)
            }
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
    return { createNewMoveMutation }
}