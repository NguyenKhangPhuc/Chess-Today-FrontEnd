import apiClient from "../libs/api"
import { MessageAttributes } from "../types/message"

export const createMessage = async (message: MessageAttributes) => {
    try {
        const response = await apiClient.post('/message', message)
        return response.data
    } catch (error) {
        throw new Error('Failed to create new message')
    }
}

export const getChatBoxMessages = async (chatBoxId: string) => {
    try {
        const response = await apiClient.get(`/message/${chatBoxId}`)
        return response.data;
    } catch (error) {
        throw new Error('Failed to get messages');
    }
}

