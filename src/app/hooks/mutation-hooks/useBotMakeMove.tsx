import { useNotification } from "@/app/contexts/NotificationContext"
import { botMakeMove } from "@/app/services/analyze"
import { EngineScore } from "@/app/types/engine"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

// Custom hooks to create a mutation for making a bot move
export const useBotMakeMove = ({ handleBotMove }: { handleBotMove: (res: { moveInfo: { bestMove: string, score: EngineScore | undefined } }) => void }) => {
    const { showNotification } = useNotification();
    const botMakeMoveMutation = useMutation({
        mutationKey: ['bot_make_move'],
        mutationFn: botMakeMove,
        onSuccess: (res: { moveInfo: { bestMove: string, score: EngineScore | undefined } }) => {
            handleBotMove(res)
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
    return { botMakeMoveMutation }
}