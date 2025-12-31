import { useGetGameMessage } from "@/app/hooks/query-hooks/useGetGameMessage";
import { useCreateGameMessage } from "@/app/hooks/mutation-hooks/useCreateGameMessage";
import { useEffect, useRef, useState } from "react";
import { UserAttributes } from "@/app/types/user";
import { QueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import dayjs from "dayjs";
import SendIcon from '@mui/icons-material/Send';

// The in-game information of the user
interface UserInMatchInformation {
    myInformation: UserAttributes,
    opponent: UserAttributes
}

// The prop type of the chatBox
interface ChatBoxProps {
    me: UserInMatchInformation,
    queryClient: QueryClient,
    gameId: string,
    socket: Socket
}

const ChatBox = ({ me, queryClient, gameId, socket }: ChatBoxProps) => {
    // Input to store the message of the user
    const [message, setMessage] = useState('')
    // To scroll down when receive new message
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        // Scroll down the the div where ref is messagesEndRef
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    // Get the game messages from the gameId
    const { data: gameMessages, isLoading } = useGetGameMessage(gameId);
    // Get the mutation to create new message
    const { createGameMessagesMutation } = useCreateGameMessage({ queryClient, socket, opponentId: me.opponent.id, gameId });

    useEffect(() => { scrollToBottom() }, [gameMessages])

    const handleSendMessage = () => {
        // Create a new message using the mutation above
        console.log(message)
        if (message.length == 0) return;
        createGameMessagesMutation.mutate({ gameId: gameId, senderId: me.myInformation.id, content: message })
    }
    // Handle the key down to know which key the user press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            // If the user press enter -> send the message
            if (message.length == 0) return;
            e.preventDefault()
            handleSendMessage()
            setMessage('')
        }
    }
    return (
        <div className="flex flex-col w-full h-[300px] bg-[#1c1b1a]  shadow-md p-4 text-sm mt-5">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <div className="font-semibold text-gray-200">
                    💬 Chat with <span className="text-white">{me.opponent.name}</span>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto space-y-3 pr-2">
                {gameMessages?.map((msg) => {
                    const isMe = msg.senderId === me.myInformation.id;
                    return (
                        <div
                            key={`Message ${msg.id}`}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"
                                } w-full`}
                        >
                            <div className="text-[10px] text-gray-400 mb-1">
                                {dayjs(msg.createdAt).format("HH:mm")} ·{" "}
                                {isMe ? "You" : me.opponent.name}
                            </div>
                            <div
                                className={`px-3 py-2 max-w-[70%] rounded-2xl break-words ${isMe
                                    ? "bg-[#3b3a38] text-white rounded-br-none"
                                    : "bg-[#111010] text-gray-200 rounded-bl-none"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-3 flex items-center gap-2">
                <input
                    className="flex-1 bg-[#111010]/60 text-gray-100 placeholder-gray-400 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[#6e3410] transition"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSendMessage}
                    className="flex items-center justify-center bg-[#6e3410] hover:bg-[#844a25] transition text-white font-semibold px-4 py-2 rounded-lg"
                >
                    <SendIcon sx={{ fontSize: 18 }} />
                </button>
            </div>
        </div>

    )
}

export default ChatBox