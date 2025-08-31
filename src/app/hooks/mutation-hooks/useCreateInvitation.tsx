import { sendInvitation } from "@/app/services/invitations"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useCreateNewInvitation = ({ queryClient }: { queryClient: QueryClient }) => {
    const createInvitationMutation = useMutation({
        mutationKey: ['create_invitation'],
        mutationFn: sendInvitation,
        onSuccess: (data) => {
            alert('Invitation sent')
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['current_user'] })
        }

    })
    return { createInvitationMutation }
}