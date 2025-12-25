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

export const updateElo = async ({ gameType, userElo }: { gameType: GAME_TYPE, userElo: number }) => {
    try {
        const response = await apiClient.put('/user/update-elo', { gameType, userElo })
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