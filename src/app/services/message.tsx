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