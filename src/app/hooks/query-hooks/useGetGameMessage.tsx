import { getGameMessages } from "@/app/services/gameMessage"
import { GameMessagesAttributes } from "@/app/types/gameMessage"
import { useQuery } from "@tanstack/react-query"

export const useGetGameMessage = (gameId: string) => {
    const { data, isLoading } = useQuery<Array<GameMessagesAttributes>>({
        queryKey: [`game messages ${gameId}`],
        queryFn: () => getGameMessages(gameId),
    })
    return { data, isLoading }
}