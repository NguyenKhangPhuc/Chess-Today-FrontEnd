import { getChallengeById } from "@/app/services/challenge"
import { ChallengeAttributes } from "@/app/types/challenge"
import { useQuery } from "@tanstack/react-query"

export const useGetChallengeById = (challengeId: string) => {
    const { data: challenge, isLoading: isChallengeLoading } = useQuery<ChallengeAttributes>({
        queryKey: ['fetch_challenge'],
        queryFn: () => getChallengeById(challengeId)
    })
    return { challenge, isChallengeLoading }
}