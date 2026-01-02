import { io, Socket } from "socket.io-client";
let socket: Socket | null = null

export const getSocket = () => {
    if (!socket) {
        console.log("socket connection");
        socket = io('http://localhost:3001', {
            withCredentials: true,
        })
        socket.on("connect", () => console.log("Socket connected", socket!.id));
    }
    return socket;
}


