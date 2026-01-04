import { useNotification } from "@/app/contexts/NotificationContext"
import { createChatBox } from "@/app/services/chatbox"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

// Custom hook for create a mutation to create a new chatbox
export const useCreateNewChatBox = ({ queryClient }: { queryClient: QueryClient }) => {
    const { showNotification } = useNotification();
    const createNewChatBoxMutation = useMutation({
        mutationKey: ['create_chatbox'],
        mutationFn: createChatBox,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['fetch_chatboxes'] })
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
    return { createNewChatBoxMutation }
}