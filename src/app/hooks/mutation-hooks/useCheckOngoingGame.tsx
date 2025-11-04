import { checkOngoingGame } from "@/app/services/game";
import { useMutation } from "@tanstack/react-query";

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