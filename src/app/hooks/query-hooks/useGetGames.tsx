import { getUserGame } from "@/app/services/game"
import { GameAttributes } from "@/app/types/game"
import { PaginationAttributes } from "@/app/types/pagination"
import { PageParam } from "@/app/types/types"
import { useQuery } from "@tanstack/react-query"

// Custom hooks to get all the games based on the userId with pagination
export const useGetGames = ({ userId, cursor }: { userId: string, cursor: PageParam | undefined }) => {
    const { data, isLoading } = useQuery<PaginationAttributes<GameAttributes>>({
        queryKey: [`game`, cursor, userId],
        queryFn: () => getUserGame(userId, cursor?.after, cursor?.before),
    })
    return { data, isLoading }
}