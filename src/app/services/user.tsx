import apiClient from "../libs/api";
import { GAME_TYPE } from "../types/enum";

export const getMe = async () => {
    const response = await apiClient.get(`/user`, { withCredentials: true });
    return response.data;

}


export const getUsers = async (after: string | undefined, before: string | undefined) => {
    try {
        const response = await apiClient.get(`/user/people?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch all users')
    }
}

export const updateElo = async ({ gameId, gameType, userElo, opponentId, opponentElo }: { gameId: string, gameType: GAME_TYPE, userElo: number, opponentId: string, opponentElo: number }) => {
    try {
        const response = await apiClient.put('/user/update-elo', { gameId, gameType, userElo, opponentId, opponentElo })
        return response.data
    } catch (error) {
        throw new Error('Failed to update user elo')
    }
}

export const getAuthentication = async () => {
    try {
        const response = await apiClient.get('/user/check')
        return response.data
    } catch (error) {
        throw new Error('Failed to update user elo')
    }
}

export const getSpecificUserInfo = async (userId: string) => {
    try {
        const response = await apiClient.get(`/user/${userId}`);
        return response.data
    } catch (error) {
        throw new Error('Failed to update user elo')
    }
}

export const updateUserPassword = async (payload: { username: string, code: string, oldPass: string, newPass: string }) => {
    const response = await apiClient.put('/user/update-password', payload)
    return response.data
}