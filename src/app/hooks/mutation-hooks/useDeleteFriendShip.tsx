import { useNotification } from "@/app/contexts/NotificationContext"
import { deleteFriendShip } from "@/app/services/friendship"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

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

    return { deleteFriendShipMutation }
}