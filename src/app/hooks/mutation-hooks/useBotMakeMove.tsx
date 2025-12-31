import { botMakeMove } from "@/app/services/analyze"
import { EngineScore } from "@/app/types/engine"
import { useMutation } from "@tanstack/react-query"

// Custom hooks to create a mutation for making a bot move
export const useBotMakeMove = ({ handleBotMove }: { handleBotMove: (res: { moveInfo: { bestMove: string, score: EngineScore | undefined } }) => void }) => {
    const botMakeMoveMutation = useMutation({
        mutationKey: ['bot_make_move'],
        mutationFn: botMakeMove,
        onSuccess: (res: { moveInfo: { bestMove: string, score: EngineScore | undefined } }) => {
            console.log('This is bot move', res)
            handleBotMove(res)
        }
    })
    return { botMakeMoveMutation }
}