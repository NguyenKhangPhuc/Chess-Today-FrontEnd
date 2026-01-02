import apiClient from "../libs/api"
import { VERIFICATION_TYPE } from "../types/enum";

export const createVerificationCode = async ({ type, username }: { type: VERIFICATION_TYPE, username: string }) => {
    const response = await apiClient.post('/verification', { username, type });
    return response.data
}

export const verifyingCode = async ({ code, username }: { code: string, username: string }) => {
    const response = await apiClient.post('/verification/verify-code', { code, username });
    return response.data;
}