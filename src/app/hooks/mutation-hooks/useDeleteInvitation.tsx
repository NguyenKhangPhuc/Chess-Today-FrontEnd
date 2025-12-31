import { deleteSentInvitation } from "@/app/services/invitations"
import { QueryClient, useMutation } from "@tanstack/react-query"

// Custom hook for making a mutation for deleting the invitation
export const useDeleteInvitations = ({ queryClient }: { queryClient: QueryClient }) => {
    const deleteSentInvitationMutation = useMutation({
        mutationKey: ['delete_invitation'],
        mutationFn: deleteSentInvitation,
        onSuccess: () => {
            alert('Delete invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['sent_invitations'] })
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
        }
    })
    return { deleteSentInvitationMutation }
}