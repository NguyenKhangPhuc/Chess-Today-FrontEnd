import { updateGameFen } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"

export const useUpdateGameFen = (gameId: string) => {
    const updateGameFenMutation = useMutation({
        mutationKey: [`update_game_${gameId}`],
        mutationFn: updateGameFen,
    })
    return { updateGameFenMutation }
}