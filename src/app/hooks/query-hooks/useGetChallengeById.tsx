import { getChallengeById } from "@/app/services/challenge"
import { ChallengeAttributes } from "@/app/types/challenge"
import { useQuery } from "@tanstack/react-query"

// Custom hook for get the challenge info by its id
export const useGetChallengeById = (challengeId: string) => {
    const { data: challenge, isLoading: isChallengeLoading } = useQuery<ChallengeAttributes>({
        queryKey: ['fetch_challenge'],
        queryFn: () => getChallengeById(challengeId)
    })
    return { challenge, isChallengeLoading }
}