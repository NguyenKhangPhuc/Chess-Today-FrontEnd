
import apiClient from "../libs/api"
import { EngineScore } from "../types/engine"

export const botMakeMove = async (fen: string) => {
    try {
        const response = await apiClient.post('/analyze', { fen })
        return response.data
    } catch (error) {
        throw new Error('Failed to request for a bot move')
    }
}

export const getFeedBack = async ({ move, beforeFen, score, senderId, gameId }: { move: string, beforeFen: string, score: EngineScore | null, senderId: string, gameId: string }) => {
    try {
        const response = await apiClient.post('/analyze/explanation', { move, beforeFen, score, senderId, gameId })
        return response.data
    } catch (error) {
        throw new Error('Failed to get explanation for the move')
    }
}