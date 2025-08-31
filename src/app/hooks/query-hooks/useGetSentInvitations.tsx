import { getSentInvitation } from "@/app/services/invitations"
import { Invitations } from "@/app/types/invitation"
import { PaginationAttributes } from "@/app/types/pagination"
import { PageParam } from "@/app/types/types"
import { useQuery } from "@tanstack/react-query"

export const useGetSentInvitations = ({ userId, cursor }: { userId: string, cursor: PageParam | undefined }) => {
    const { data, isLoading } = useQuery<PaginationAttributes<Invitations>>({
        queryKey: ['sent_invitations'],
        queryFn: () => getSentInvitation(userId, cursor?.after, cursor?.before)
    })
    return { data, isLoading }
}