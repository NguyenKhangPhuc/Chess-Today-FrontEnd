import { getGame } from "@/app/services/game"
import { GameAttributes } from "@/app/types/game"
import { useQuery } from "@tanstack/react-query"

export const useGetGameId = (id: string) => {
    const { data, isLoading } = useQuery<GameAttributes>({
        queryKey: [`game ${id}`],
        queryFn: () => getGame(id),
    })
    return { data, isLoading }
}