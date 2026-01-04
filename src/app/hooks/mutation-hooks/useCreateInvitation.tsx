import { useNotification } from "@/app/contexts/NotificationContext"
import { sendInvitation } from "@/app/services/invitations"
import { Invitations } from "@/app/types/invitation"
import { UserBasicAttributes } from "@/app/types/user"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Socket } from "socket.io-client"

// Custom hooks to create a mutation for making a new invitation to other user
export const useCreateNewInvitation = ({ queryClient, socket, sender, }: { queryClient: QueryClient, socket: Socket, sender: UserBasicAttributes }) => {
    const { showNotification } = useNotification();
    const createInvitationMutation = useMutation({
        mutationKey: ['create_invitation'],
        mutationFn: sendInvitation,
        onSuccess: (data: Invitations) => {
            showNotification('Invitation sent')
            queryClient.invalidateQueries({ queryKey: ['sent_invitations'] })
            socket.emit('new_invitations', { sender, receiverId: data.receiverId })
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
    return { createInvitationMutation }
}