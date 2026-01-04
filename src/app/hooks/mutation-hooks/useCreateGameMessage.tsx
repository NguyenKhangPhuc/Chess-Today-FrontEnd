import { useNotification } from "@/app/contexts/NotificationContext"
import { createGameMessages } from "@/app/services/gameMessage"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Socket } from "socket.io-client"

// Custom hooks to create a new game messages
export const useCreateGameMessage = ({ queryClient, socket, opponentId, gameId }: { queryClient: QueryClient, socket: Socket, opponentId: string, gameId: string }) => {
    const { showNotification } = useNotification();
    const createGameMessagesMutation = useMutation({
        mutationKey: [`create_game_message`],
        mutationFn: createGameMessages,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`game messages ${gameId}`] })
            socket.emit('announce_new_message', opponentId)
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
    return { createGameMessagesMutation }
}