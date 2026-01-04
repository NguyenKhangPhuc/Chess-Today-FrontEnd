import { useNotification } from "@/app/contexts/NotificationContext"
import { createBotGame } from "@/app/services/game"
import { GameAttributes } from "@/app/types/game"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

// Custom hooks to create the mutation for making the "user vs bot" game
export const useCreateBotGame = ({ router, setIsMatchMaking }: { router: AppRouterInstance, setIsMatchMaking: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { showNotification } = useNotification();
    const createNewBotGameMutation = useMutation({
        mutationKey: ['create_bot_game'],
        mutationFn: createBotGame,
        onSuccess: ({ response }: { response: GameAttributes }) => {
            router.push(`/chess/learn-with-AI/${response.id}`)
            setIsMatchMaking(false)
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
    return { createNewBotGameMutation }
}