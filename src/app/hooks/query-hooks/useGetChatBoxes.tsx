import { getChatBox } from "@/app/services/chatbox"
import { ChatBoxAttributes } from "@/app/types/chatbox"
import { useQuery } from "@tanstack/react-query"

export const useGetChatBoxes = () => {
    const { data, isLoading } = useQuery<Array<ChatBoxAttributes>>({
        queryKey: ['fetch_chatboxes'],
        queryFn: getChatBox,
    })
    return { data, isLoading }
}