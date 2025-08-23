import apiClient from "../libs/api"

export const getChatBox = async () => {
    try {
        const response = await apiClient.get('/chatbox')
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch chatbox')
    }
}

export const createChatBox = async ({ user1Id, user2Id }: { user1Id: string, user2Id: string }) => {
    try {
        const response = await apiClient.post('/chatbox', { user1Id, user2Id })
        return response.data
    } catch (error) {
        throw new Error('Failed to create new chatbox')
    }
}