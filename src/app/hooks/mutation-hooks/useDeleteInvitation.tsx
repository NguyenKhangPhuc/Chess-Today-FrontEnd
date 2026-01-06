import { useNotification } from "@/app/contexts/NotificationContext"
import { deleteSentInvitation } from "@/app/services/invitations"
import { UserBasicAttributes } from "@/app/types/user";
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { Socket } from "socket.io-client";

// Custom hook for making a mutation for deleting the invitation
export const useDeleteInvitations = ({ queryClient, socket }: { queryClient: QueryClient, socket: Socket }) => {
    const { showNotification } = useNotification();
    const deleteSentInvitationMutation = useMutation({
        mutationKey: ['delete_invitation'],
        mutationFn: deleteSentInvitation,
        onSuccess: (data: { userDelete: UserBasicAttributes, userReceiveId: string }) => {
            showNotification('Delete invitation successfully');
            queryClient.invalidateQueries({ queryKey: ['sent_invitations'] })
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
            socket.emit('decline_invitation', { userDelete: data.userDelete, userReceiveId: data.userReceiveId });
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