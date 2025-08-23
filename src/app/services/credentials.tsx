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