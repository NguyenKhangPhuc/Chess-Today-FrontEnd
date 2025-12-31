import { checkOngoingGame } from "@/app/services/game";
import { useMutation } from "@tanstack/react-query";

// Custom hook to create a mutation for checking users' ongoing game
export const useCheckOngoingGame = () => {
    const checkOngoingGameMutation = useMutation({
        mutationKey: ['check_ongoing_game'],
        mutationFn: checkOngoingGame,
        onError: (error) => {
            console.log(error);
        }
    })
    return { checkOngoingGameMutation }
}