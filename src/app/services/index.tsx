import apiClient from "../libs/api";
import { Invitations, LoginAttributes, SignUpAttributes } from "../types/types";

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


export const friendship = async (friendId: string) => {
    try {
        const response = await apiClient.post('/friendship', { friendId });
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
        throw new Error('Failed to fetch current user data');
    }
}


export const getUsers = async () => {
    try {
        const response = await apiClient.get('/user/people')
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch all users')
    }
}

export const sendInvitation = async (receiverId: string) => {
    try {
        const response = await apiClient.post('/invite', { receiverId })
        return response.data
    } catch (error) {
        throw new Error('Failed to send invitations')
    }
}

export const deleteSentInvitation = async (invitationId: string) => {
    try {
        await apiClient.delete(`/invite/${invitationId}`)
    } catch (error) {
        throw new Error('Failed to delete the invitation')
    }
}

export const acceptInvitation = async ({ invitationId, friendId }: { invitationId: string, friendId: string }) => {
    try {
        const response = await apiClient.post('/friendship', { friendId })
        await deleteSentInvitation(invitationId);
        return response.data
    } catch (error) {
        throw new Error('Failed to delete the invitation')
    }
}