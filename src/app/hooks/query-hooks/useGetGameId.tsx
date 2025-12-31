import { getGame } from "@/app/services/game"
import { GameAttributes } from "@/app/types/game"
import { useQuery } from "@tanstack/react-query"

// Custom hook to get the game information by its id
export const useGetGameId = (id: string) => {
    const { data, isLoading } = useQuery<GameAttributes>({
        queryKey: [`game_${id}`],
        queryFn: () => getGame(id),
    })
    return { data, isLoading }
}