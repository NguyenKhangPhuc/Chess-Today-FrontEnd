import { useNotification } from "@/app/contexts/NotificationContext"
import { deleteSentInvitation } from "@/app/services/invitations"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

// Custom hook for making a mutation for deleting the invitation
export const useDeleteInvitations = ({ queryClient }: { queryClient: QueryClient }) => {
    const { showNotification } = useNotification();
    const deleteSentInvitationMutation = useMutation({
        mutationKey: ['delete_invitation'],
        mutationFn: deleteSentInvitation,
        onSuccess: () => {
            showNotification('Delete invitation successfully');
            queryClient.invalidateQueries({ queryKey: ['sent_invitations'] })
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
        },
        onError: (error) => {
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            showNotification(message);
        }
    })
    return { deleteSentInvitationMutation }
}