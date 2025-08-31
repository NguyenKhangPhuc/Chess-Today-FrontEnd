import { createNewGameMoves } from "@/app/services/move";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

export const useCreateNewMove = ({ gameId, socket, opponentId, queryClient }: { gameId: string, socket: Socket | null, opponentId: string | null, queryClient: QueryClient }) => {
    const createNewMoveMutation = useMutation({
        mutationKey: ['create_new_move'],
        mutationFn: createNewGameMoves,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [`moves_game_${gameId}`] })
            console.log(data)
            if (socket && opponentId) {
                socket.emit('new_move_history', opponentId)
            }
        }
    })
    return { createNewMoveMutation }
}