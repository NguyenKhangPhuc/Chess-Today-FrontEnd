import { useNotification } from "@/app/contexts/NotificationContext"
import { acceptInvitation } from "@/app/services/friendship"
import { QueryClient, useMutation } from "@tanstack/react-query"

// Custom hook to create mutation to accept the invitation
export const useAcceptInvitations = ({ queryClient }: { queryClient: QueryClient }) => {
    const { showNotification } = useNotification();
    const acceptInvitationMutation = useMutation({
        mutationKey: ['accept_invitation'],
        mutationFn: acceptInvitation,
        onSuccess: (data) => {
            showNotification('Accept invitation successfully');
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['friendship'] })
        }
    })
    return { acceptInvitationMutation }
}