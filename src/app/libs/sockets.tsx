import { io, Socket } from "socket.io-client";
let socket: Socket | null = null

export const getSocket = () => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ? process.env.NEXT_PUBLIC_SOCKET_URL : '', {
            withCredentials: true,
        })
        socket.on('socket_error', (error) => console.log(error))
    }
    return socket;
}


