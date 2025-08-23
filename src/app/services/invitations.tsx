import apiClient from "../libs/api"

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

export const getSentInvitation = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    if (!userId) return []
    try {
        const response = await apiClient.get(`/invite/sender/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to get sent invitations')
    }
}

export const getMyInvitations = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    if (!userId) return []
    try {
        const response = await apiClient.get(`/invite/receiver/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to get sent invitations')
    }
}