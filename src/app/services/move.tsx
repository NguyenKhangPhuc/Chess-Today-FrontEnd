import apiClient from "../libs/api"
import { MoveAttributes } from "../types/move"

export const getGameMoves = async (gameId: string) => {
    try {
        const response = await apiClient.post('/move/game', { gameId })
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch game moves')
    }
}

export const createNewGameMoves = async (newMove: MoveAttributes) => {
    try {
        const response = await apiClient.post('/move', newMove)
        return response.data
    } catch (error) {
        throw new Error('Failed to create new move')
    }
}
