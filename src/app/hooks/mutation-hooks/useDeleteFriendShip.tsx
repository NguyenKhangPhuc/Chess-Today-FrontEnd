import { deleteFriendShip } from "@/app/services/friendship"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useDeleteFriendShip = (queryClient: QueryClient) => {
    const deleteFriendShipMutation = useMutation({
        mutationKey: ['delete_friendship'],
        mutationFn: deleteFriendShip,
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['friendship'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            alert('Delete successfully')
        }
    })

    return { deleteFriendShipMutation }
}