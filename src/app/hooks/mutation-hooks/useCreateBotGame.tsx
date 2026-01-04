import { createBotGame } from "@/app/services/game"
import { GameAttributes } from "@/app/types/game"
import { useMutation } from "@tanstack/react-query"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

// Custom hooks to create the mutation for making the "user vs bot" game
export const useCreateBotGame = ({ router, setIsMatchMaking }: { router: AppRouterInstance, setIsMatchMaking: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const createNewBotGameMutation = useMutation({
        mutationKey: ['create_bot_game'],
        mutationFn: createBotGame,
        onSuccess: ({ response }: { response: GameAttributes }) => {
            router.push(`/chess/learn-with-AI/${response.id}`)
            setIsMatchMaking(false)
        }
    })
    return { createNewBotGameMutation }
}