import { io, Socket } from "socket.io-client";
let socket: Socket | null = null

export const getSocket = () => {
    if (!socket) {
        socket = io('http://localhost:3001', {
            auth: {
                token: typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
            }
        })
    }
    return socket;
}


