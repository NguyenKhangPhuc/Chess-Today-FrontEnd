import { createChatBox } from "@/app/services/chatbox"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useCreateNewChatBox = ({ queryClient }: { queryClient: QueryClient }) => {
    const createNewChatBoxMutation = useMutation({
        mutationKey: ['create_chatbox'],
        mutationFn: createChatBox,
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['fetch_chatboxes'] })
        }
    })
    return { createNewChatBoxMutation }
}