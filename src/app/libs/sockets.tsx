import { io, Socket } from "socket.io-client";
let socket: Socket | null = null

export const getSocket = () => {
    console.log("Is socket null", socket)
    if (!socket) {
        socket = io('http://localhost:3001', {
            withCredentials: true,
        })
        socket.on("connect", () => console.log("Socket connected", socket!.id));
        socket.on("connect_error", (err) => console.error("Connect error:", err));
    }
    return socket;
}


