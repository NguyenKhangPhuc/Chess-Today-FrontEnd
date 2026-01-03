import axios from "axios";
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : '',
    withCredentials: true,
})

export let token: string | null = null;

if (typeof window !== "undefined") {
    token = localStorage.getItem("userToken");
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

export const setTokenToHeader = () => {
    token = localStorage.getItem("userToken");
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

export const removeTokenToHeader = () => {
    apiClient.defaults.headers.common["Authorization"] = null;
}

export default apiClient;