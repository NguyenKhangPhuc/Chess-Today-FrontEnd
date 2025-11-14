import { getGameMoves } from "@/app/services/move"
import { MoveAttributes } from "@/app/types/move"
import { useQuery } from "@tanstack/react-query"

export const useGetGameMoves = (gameId: string) => {
    const { data, isLoading, refetch } = useQuery<Array<MoveAttributes>>({
        queryKey: [`moves_game_${gameId}`],
        queryFn: () => getGameMoves(gameId),
    })
    return { data, isLoading, refetch }
}