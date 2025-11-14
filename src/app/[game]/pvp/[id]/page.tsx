'use client';
import ChessPvP from "@/app/Components/ChessPvP";
import { getSocket } from "@/app/libs/sockets";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs'
import { RestartAlt } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import { UserAttributes } from "@/app/types/user";
import Loader from "@/app/Components/Loader";
import { useMe } from "@/app/hooks/query-hooks/useMe";
import { Socket } from "socket.io-client";
import { useGetGameMessage } from "@/app/hooks/query-hooks/useGetGameMessage";
import { useGetGameId } from "@/app/hooks/query-hooks/useGetGameId";
import { useGetGameMoves } from "@/app/hooks/query-hooks/useGetGameMoves";
import { useCreateGameMessage } from "@/app/hooks/mutation-hooks/useCreateGameMessage";
import ChessPvpMemo from "@/app/Components/ChessPvP";

interface UserInMatchInformation {
    myInformation: UserAttributes,
    opponent: UserAttributes
}

interface ChatBoxProps {
    me: UserInMatchInformation,
    queryClient: QueryClient,
    gameId: string,
    socket: Socket
}

const ChatBox = ({ me, queryClient, gameId, socket }: ChatBoxProps) => {
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const { data: gameMessages, isLoading } = useGetGameMessage(gameId);
    const { createGameMessagesMutation } = useCreateGameMessage({ queryClient, socket, opponentId: me.opponent.id, gameId });
    useEffect(() => { scrollToBottom() }, [gameMessages])
    const handleSendMessage = () => {
        console.log(message)
        createGameMessagesMutation.mutate({ gameId: gameId, senderId: me.myInformation.id, content: message })
    }
    return (
        <div className="flex flex-col w-full h-[300px] bg-[#1c1b1a]  shadow-md p-4 text-sm mt-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <div className="font-semibold text-gray-200">
                    💬 Chat with <span className="text-white">{me.opponent.name}</span>
                </div>
            </div>

            {/* Messages */}
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

            {/* Input area */}
            <div className="mt-3 flex items-center gap-2">
                <input
                    className="flex-1 bg-[#111010]/60 text-gray-100 placeholder-gray-400 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[#6e3410] transition"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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

const Home = () => {
    const queryClient = useQueryClient()
    const socket = getSocket()
    const { id }: { id: string } = useParams()
    useEffect(() => {
        socket.on('announce_new_message', () => {
            queryClient.invalidateQueries({ queryKey: [`game messages ${id}`] })
        })
    }, [])
    const { me: userData, isLoading } = useMe();
    const { data: game, isLoading: isGameLoading } = useGetGameId(id)
    const { data: gameMoves, isLoading: isGameMoveLoading } = useGetGameMoves(id)
    if (isLoading || isGameLoading || !game || !userData || !gameMoves) return (
        <div className="w-full h-screen bg-black flex justify-center items-center"><Loader /></div>
    )
    console.log(isLoading || !game || !userData || !gameMoves || isGameMoveLoading)
    const me = {
        myInformation: userData.id === game.player1.id ? game.player1 : game.player2,
        opponent: userData.id === game.player1.id ? game.player2 : game.player1
    }
    console.log('This is game moves', gameMoves)
    return (
        <div className="w-full min-h-screen flex items-center justify-center gap-5 bg-[#1a1917]">

            <ChessPvpMemo data={game} userData={userData} queryClient={queryClient} />


            <div className="w-1/3 flex flex-col rounded-2xl shadow-xl bg-[#1f1e1b] border border-[#2c2b29] overflow-hidden text-white">


                <div className="flex text-sm font-semibold uppercase tracking-wider border-b border-[#3a3937]">
                    <div className="w-1/2 text-center p-4 bg-[#302e2b] border-r border-[#3a3937] cursor-pointer hover:bg-[#3a3835] transition">
                        Các nước đi
                    </div>
                    <div className="w-1/2 text-center p-4 bg-[#1f1e1b] cursor-pointer hover:bg-[#2a2926] transition">
                        Thông tin
                    </div>
                </div>


                <div className="h-[300px] overflow-y-auto bg-black/20 p-2 rounded-b-lg ">
                    <div className="flex flex-wrap">
                        {gameMoves.map((move, index) => (
                            <div
                                key={`move-${move.id}`}
                                className={`w-1/2 flex items-center justify-center gap-2 py-2 font-medium ${Math.floor(index / 2) % 2 === 0 ? "bg-[#2a2926]/80" : ""
                                    }`}
                            >
                                <span className="opacity-70">{index + 1}.</span>
                                <span>{move.lan}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 px-5 mt-3">
                    <button
                        className="w-1/2 py-3 bg-[#302e2b] hover:bg-[#454441] font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <AddIcon fontSize="small" />
                        New Game
                    </button>
                    <button
                        className="w-1/2 py-3 bg-[#302e2b] hover:bg-[#454441] font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <RestartAlt fontSize="small" />
                        Play Again
                    </button>
                </div>

                <div className="mt-4 border-t border-[#3a3937]">
                    <ChatBox me={me} queryClient={queryClient} socket={socket} gameId={id} />
                </div>
            </div>
        </div>

    )
}

export default Home