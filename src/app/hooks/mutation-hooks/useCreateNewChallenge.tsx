import { useNotification } from "@/app/contexts/NotificationContext";
import { createChallenge } from "@/app/services/challenge";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Socket } from "socket.io-client";

// Custom hook to create a mutation for making a new challenge
export const useCreateNewChallenge = ({ socket, router }: { socket: Socket, router: AppRouterInstance }) => {
    const { showNotification } = useNotification();
    const createChallengeMutation = useMutation({
        mutationKey: ['create_challenge'],
        mutationFn: createChallenge,
        onSuccess: (challenge: ChallengeAttributes) => {
            socket.emit('new_challenge', challenge)
            showNotification('Challenge sent');
            router.push(`/challenge/${challenge.id}`)
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
    return { createChallengeMutation }
}