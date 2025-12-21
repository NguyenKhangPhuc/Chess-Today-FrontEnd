import { getChallengeById } from "@/app/services/challenge"
import { useQuery } from "@tanstack/react-query"

export const useGetChallengeById = (challengeId: string) => {
    const { data: challenge, isLoading: isChallengeLoading } = useQuery({
        queryKey: ['fetch_challenge'],
        queryFn: () => getChallengeById(challengeId)
    })
    return { challenge, isChallengeLoading }
}