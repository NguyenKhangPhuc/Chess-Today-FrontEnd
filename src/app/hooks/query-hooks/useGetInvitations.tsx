import { getMyInvitations } from "@/app/services/invitations"
import { Invitations } from "@/app/types/invitation"
import { PaginationAttributes } from "@/app/types/pagination"
import { PageParam } from "@/app/types/types"
import { useQuery } from "@tanstack/react-query"
// Custom hooks to get all the invitations by the userId
export const useGetInvitations = ({ userId, cursor }: { userId: string, cursor: PageParam | undefined }) => {
    const { data, isLoading } = useQuery<PaginationAttributes<Invitations>>({
        queryKey: ['my_invitations', cursor],
        queryFn: () => getMyInvitations(userId, cursor?.after, cursor?.before)
    })
    return { data, isLoading }
}