import { acceptInvitation } from "@/app/services/friendship"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useAcceptInvitations = ({ queryClient }: { queryClient: QueryClient }) => {
    const acceptInvitationMutation = useMutation({
        mutationKey: ['accept_invitation'],
        mutationFn: acceptInvitation,
        onSuccess: (data) => {
            console.log(data)
            alert('Accept invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['friendships'] })
        }
    })
    return { acceptInvitationMutation }
}