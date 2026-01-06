import { useNotification } from "@/app/contexts/NotificationContext"
import { acceptInvitation } from "@/app/services/friendship"
import { UserBasicAttributes } from "@/app/types/user";
import { QueryClient, useMutation } from "@tanstack/react-query"
import { Socket } from "socket.io-client";

// Custom hook to create mutation to accept the invitation
export const useAcceptInvitations = ({ queryClient, socket }: { queryClient: QueryClient, socket: Socket }) => {
    const { showNotification } = useNotification();
    const acceptInvitationMutation = useMutation({
        mutationKey: ['accept_invitation'],
        mutationFn: acceptInvitation,
        onSuccess: (data: { receiver: UserBasicAttributes, senderId: string }) => {
            showNotification('Accept invitation successfully');
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['friendship'] })
            socket.emit('accept_invitation', { receiver: data.receiver, senderId: data.senderId })
        }
    })
    return { acceptInvitationMutation }
}