import { createChallenge } from "@/app/services/challenge";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useMutation } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Socket } from "socket.io-client";

export const useCreateNewChallenge = ({ socket, router }: { socket: Socket, router: AppRouterInstance }) => {
    const createChallengeMutation = useMutation({
        mutationKey: ['create_challenge'],
        mutationFn: createChallenge,
        onSuccess: (challenge: ChallengeAttributes) => {
            socket.emit('new_challenge', challenge)
            alert('Challenge sent');
            router.push(`/challenge/${challenge.id}`)
        }
    })
    return { createChallengeMutation }
}