import apiClient from "../libs/api";
import { ChallengeAttributes } from "../types/challenge";

export const createChallenge = async (challenge: ChallengeAttributes) => {
    try {
        const response = await apiClient.post('/challenge', { challenge })
        return response.data;
    } catch (error) {
        throw new Error('Fail to create new challenge');
    }
}

export const getChallengeById = async (challengeId: string) => {
    {
        try {
            const response = await apiClient.get(`/challenge/${challengeId}`)
            return response.data
        } catch (error) {
            throw new Error('Failed to fetch challenge')
        }
    }
}