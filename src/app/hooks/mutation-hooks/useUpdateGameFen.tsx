import { updateGameFen } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"

// Custom hook to update the game fen
export const useUpdateGameFen = (gameId: string) => {
    const updateGameFenMutation = useMutation({
        mutationKey: [`update_game_${gameId}`],
        mutationFn: updateGameFen,
    })
    return { updateGameFenMutation }
}