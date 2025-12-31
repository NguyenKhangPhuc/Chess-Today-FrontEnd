import { sendInvitation } from "@/app/services/invitations"
import { Invitations } from "@/app/types/invitation"
import { UserBasicAttributes } from "@/app/types/user"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { Socket } from "socket.io-client"

// Custom hooks to create a mutation for making a new invitation to other user
export const useCreateNewInvitation = ({ queryClient, socket, sender, }: { queryClient: QueryClient, socket: Socket, sender: UserBasicAttributes }) => {
    const createInvitationMutation = useMutation({
        mutationKey: ['create_invitation'],
        mutationFn: sendInvitation,
        onSuccess: (data: Invitations) => {
            alert('Invitation sent')
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['sent_invitations'] })
            socket.emit('new_invitations', { sender, receiverId: data.receiverId })
        }

    })
    return { createInvitationMutation }
}