import { createGameMessages } from "@/app/services/gameMessage"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { Socket } from "socket.io-client"

export const useCreateGameMessage = ({ queryClient, socket, opponentId, gameId }: { queryClient: QueryClient, socket: Socket, opponentId: string, gameId: string }) => {
    const createGameMessagesMutation = useMutation({
        mutationKey: [`create_game_message`],
        mutationFn: createGameMessages,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`game messages ${gameId}`] })
            socket.emit('announce_new_message', opponentId)
        }
    })
    return { createGameMessagesMutation }
}