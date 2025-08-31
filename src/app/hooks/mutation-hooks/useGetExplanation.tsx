import { getFeedBack } from "@/app/services/analyze"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useGetExplanation = ({ gameId, createBotMove, queryClient }: { gameId: string, createBotMove: () => void, queryClient: QueryClient }) => {
    const getExplanationMutation = useMutation({
        mutationKey: ['get_explanation'],
        mutationFn: getFeedBack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`game messages ${gameId}`] })
            createBotMove()
        }
    })
    return { getExplanationMutation }
}