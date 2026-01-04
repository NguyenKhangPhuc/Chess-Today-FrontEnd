import { deleteFriendShip } from "@/app/services/friendship"
import { QueryClient, useMutation } from "@tanstack/react-query"

// Custom hook to make a mutation for delete a friendship
export const useDeleteFriendShip = (queryClient: QueryClient) => {
    const deleteFriendShipMutation = useMutation({
        mutationKey: ['delete_friendship'],
        mutationFn: deleteFriendShip,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['friendship'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            alert('Delete successfully')
        }
    })

    return { deleteFriendShipMutation }
}