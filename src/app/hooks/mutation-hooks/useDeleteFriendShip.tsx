import { useNotification } from "@/app/contexts/NotificationContext"
import { deleteFriendShip } from "@/app/services/friendship"
import { ProfileAttributes, UserAttributes, UserBasicAttributes } from "@/app/types/user";
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { Socket } from "socket.io-client";

// Custom hook to make a mutation for delete a friendship
export const useDeleteFriendShip = ({ queryClient, socket, userInfo }: { queryClient: QueryClient, socket: Socket, userInfo: UserBasicAttributes | UserAttributes }) => {
    const { showNotification } = useNotification();
    const deleteFriendShipMutation = useMutation({
        mutationKey: ['delete_friendship'],
        mutationFn: deleteFriendShip,
        onSuccess: (data: { message: string, userDeletedId: string }) => {
            queryClient.invalidateQueries({ queryKey: ['friendship'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            socket.emit('delete_friend', { user: userInfo, userDeletedId: data.userDeletedId })
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