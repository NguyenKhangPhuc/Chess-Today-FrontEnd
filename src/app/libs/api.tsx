import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api'
})

export let token: string | null = null;

if (typeof window !== "undefined") {
    token = localStorage.getItem("userToken");
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

export default apiClient;