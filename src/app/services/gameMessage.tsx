import apiClient from "../libs/api"
import { GameMessagesAttributes } from "../types/gameMessage"

export const getGameMessages = async (gameId: string) => {
    try {
        const response = await apiClient.get(`/game-messages/${gameId}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch the messages')
    }
}

export const createGameMessages = async (gameMessages: GameMessagesAttributes) => {
    try {
        const response = await apiClient.post('/game-messages', gameMessages)
        return response.data
    } catch (error) {
        throw new Error('Failed to create new game message')
    }
}