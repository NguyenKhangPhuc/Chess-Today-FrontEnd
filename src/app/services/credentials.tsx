import apiClient from "../libs/api";
import { LoginAttributes, SignUpAttributes } from "../types/types";

export const signUp = async (data: SignUpAttributes) => {
    const response = await apiClient.post('/sign-up', data);
    return response.data;
}


export const login = async (data: LoginAttributes) => {
    const response = await apiClient.post('/login', data);
    return response.data;
}

export const logout = async () => {
    const response = await apiClient.post('/logout');
    return response.data;

}