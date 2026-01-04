import { createChatBox } from "@/app/services/chatbox"
import { QueryClient, useMutation } from "@tanstack/react-query"

// Custom hook for create a mutation to create a new chatbox
export const useCreateNewChatBox = ({ queryClient }: { queryClient: QueryClient }) => {
    const createNewChatBoxMutation = useMutation({
        mutationKey: ['create_chatbox'],
        mutationFn: createChatBox,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['fetch_chatboxes'] })
        }
    })
    return { createNewChatBoxMutation }
}