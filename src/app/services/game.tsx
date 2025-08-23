import apiClient from "../libs/api";

export const getGame = async (gameId: string) => {
    try {
        const response = await apiClient.get(`/game/${gameId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch game data');
    }
}

export const updateTime = async ({ newTimeLeft, gameId }: { newTimeLeft: number, gameId: string }) => {
    try {
        const response = await apiClient.put(`/game/${gameId}`, { newTimeLeft })
        return response.data
    } catch (error) {
        throw new Error('Failed to update time')
    }
}

export const updateGameDrawResult = async (gameId: string) => {
    try {
        const response = await apiClient.put(`/game/${gameId}/draw`)
        return response.data
    } catch (error) {
        throw new Error('Failed to update game draw result')
    }
}

export const updateGameSpecificResult = async ({ gameId, winnerId, loserId }: { gameId: string, winnerId: string, loserId: string }) => {
    try {
        const response = await apiClient.put(`/game/${gameId}/specific-result`, { winnerId, loserId })
        return response.data
    } catch (error) {
        throw new Error('Failed to update game draw result')
    }
}

export const getUserGame = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    console.log(userId)
    if (userId == undefined) return []
    try {
        const response = await apiClient.get(`/game/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''} `)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch users games')
    }
}


export const createBotGame = async (type: string) => {
    try {
        const response = await apiClient.post('/game/bot', { type })
        return response.data
    } catch (error) {
        throw new Error('Failed to create bot game')
    }
}

export const updateGameFen = async ({ gameId, fen }: { gameId: string, fen: string }) => {
    try {
        const response = await apiClient.put(`/game/fen/${gameId}`, { fen })
        return response.data
    } catch (error) {
        throw new Error('Failed to update game fen')
    }
}
