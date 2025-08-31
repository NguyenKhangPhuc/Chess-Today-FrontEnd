import { deleteSentInvitation } from "@/app/services/invitations"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useDeleteInvitations = ({ queryClient }: { queryClient: QueryClient }) => {
    const deleteSentInvitationMutation = useMutation({
        mutationKey: ['delete_invitation'],
        mutationFn: deleteSentInvitation,
        onSuccess: () => {
            alert('Delete invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
        }
    })
    return { deleteSentInvitationMutation }
}