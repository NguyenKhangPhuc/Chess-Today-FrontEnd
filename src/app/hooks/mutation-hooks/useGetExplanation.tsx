import { useNotification } from "@/app/contexts/NotificationContext"
import { getFeedBack } from "@/app/services/analyze"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

// Custom hook for create a new mutation for getting the move explanation from OpenAI
export const useGetExplanation = ({ gameId, createBotMove, queryClient }: { gameId: string, createBotMove: () => void, queryClient: QueryClient }) => {
    const { showNotification } = useNotification();
    const getExplanationMutation = useMutation({
        mutationKey: ['get_explanation'],
        mutationFn: getFeedBack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`game messages ${gameId}`] })
            createBotMove()
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
    return { getExplanationMutation }
}