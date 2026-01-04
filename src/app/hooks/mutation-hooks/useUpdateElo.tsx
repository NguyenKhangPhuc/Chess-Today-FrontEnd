import { useNotification } from "@/app/contexts/NotificationContext"
import { updateElo } from "@/app/services/user"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

// Custom hook to update the user elo
export const useUpdateElo = ({ queryClient, id }: { queryClient: QueryClient, id: string }) => {
    const { showNotification } = useNotification();
    const updateEloMutation = useMutation({
        mutationKey: ['update_elo'],
        mutationFn: updateElo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`current_user`] })
            queryClient.invalidateQueries({ queryKey: [`game ${id}`] })
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
    return { updateEloMutation }
}