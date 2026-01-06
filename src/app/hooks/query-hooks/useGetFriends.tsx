import { getUserFriend } from "@/app/services/friendship"
import { FriendShipAttributes } from "@/app/types/friend"
import { PaginationAttributes } from "@/app/types/pagination"
import { PageParam } from "@/app/types/types"
import { ProfileAttributes, UserBasicAttributes } from "@/app/types/user"
import { useQuery } from "@tanstack/react-query"

// Custom hook to get all the user friend with pagination
export const useGetFriends = ({ cursor, me }: { cursor: PageParam | undefined, me: UserBasicAttributes | ProfileAttributes }) => {
    const { data, isLoading } = useQuery<PaginationAttributes<FriendShipAttributes>>({
        queryKey: [`friendship`, cursor],
        queryFn: () => getUserFriend(me?.id, cursor?.after, cursor?.before),
    })
    return { data, isLoading }
}