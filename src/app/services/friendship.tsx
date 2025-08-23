import apiClient from "../libs/api";
import { deleteSentInvitation } from "./invitations";

export const friendship = async (friendId: string) => {
    try {
        const response = await apiClient.post('/friendship', { friendId });
        return response.data;
    } catch (error) {
        throw new Error('Friendship request failed');
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

export const deleteFriendShip = async (friendshipId: string) => {
    try {
        const response = await apiClient.delete(`/friendship/${friendshipId}`);
        return response.data
    } catch (error) {
        throw new Error('Failed to delete friendship')
    }
}

export const getUserFriend = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    if (!userId) return []
    try {
        const response = await apiClient.get(`/friendship/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch user friends ')
    }
}