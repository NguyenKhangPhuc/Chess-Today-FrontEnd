import apiClient from "../libs/api"

export const createVerificationCode = async (username: string) => {
    const response = await apiClient.post('/verification', { username });
    return response.data
}

export const verifyingCode = async ({ code, username }: { code: string, username: string }) => {
    const response = await apiClient.post('/verification/verify-code', { code, username });
    return response.data;
}