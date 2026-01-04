import { useNotification } from "@/app/contexts/NotificationContext"
import { deleteFriendShip } from "@/app/services/friendship"
import { QueryClient, useMutation } from "@tanstack/react-query"

// Custom hook to make a mutation for delete a friendship
export const useDeleteFriendShip = (queryClient: QueryClient) => {
    const { showNotification } = useNotification();
    const deleteFriendShipMutation = useMutation({
        mutationKey: ['delete_friendship'],
        mutationFn: deleteFriendShip,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['friendship'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            showNotification('Delete successfully');
        }
    })

    return { deleteFriendShipMutation }
}