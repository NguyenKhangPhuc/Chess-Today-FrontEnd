import apiClient from "../libs/api";
import { LoginAttributes, SignUpAttributes } from "../types/types";

export const signUp = async (data: SignUpAttributes) => {
    try {
        const response = await apiClient.post('/sign-up', data);
        return response.data;
    } catch (error) {
        throw new Error('Sign up failed');
    }
}


export const login = async (data: LoginAttributes) => {
    try {
        const response = await apiClient.post('/login', data);
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
}


export const friendship = async () => {
    try {
        const response = await apiClient.post('/friendship', { userId: 3, friendId: 1 });
        return response.data;
    } catch (error) {
        throw new Error('Friendship request failed');
    }
}

export const getGame = async (gameId: string) => {
    try {
        const response = await apiClient.get(`/game/${gameId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch game data');
    }
}


export const getMe = async () => {
    try {
        const response = await apiClient.get(`/user`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch game data');
    }
}