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
        <div className="w-full flex flex-col p-5 h-[300px]">
            <div className="font-bold text-xl pb-5">Talk to {me.opponent.name}</div>

            <div className="w-full flex flex-col max-h-2/3 gap-2  overflow-y-auto bg-black/30">
                {gameMessages?.map((e) => {
                    return (
                        <div className={`w-full p-5 flex flex-col ${e.senderId === me.myInformation.id ? 'items-end' : 'items-start'}`} key={`Message ${e.id}`}>
                            <div className="text-[12px] font-light opacity-70">
                                {e.createdAt && dayjs(e.createdAt).format('DD/MM/YY HH:mm:ss')} * {e.senderId === me.myInformation.id ? me.myInformation.id : me.opponent.name}
                            </div>
                            <div className={`min-w-1/4 max-w-1/2 text-white p-2 break-words rounded-xl ${e.senderId === me.myInformation.id ? 'bg-[#302e2b]' : 'bg-black'}`}>
                                {e.content}
                            </div>

                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="w-full flex gap-2">
                <input className="outline-none border-t border-gray-500 w-3/4 p-3 bg-black/30" placeholder="Send your text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button
                    className="flex items-center justify-center gap-3 w-1/4 cursor-pointer bg-[#6e3410]/80  rounded-lg  font-bold text-base hover:bg-[#6e3410]"
                    onClick={() => handleSendMessage()}

                >
                    Send
                    <SendIcon sx={{ fontSize: 20 }} />
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
        <div className="w-full min-h-screen flex  items-center gap-5">
            <ChessPvP data={game} userData={userData} queryClient={queryClient} />
            <div className="w-1/3">

                <div className="w-full h-[850px] flex flex-col text-white general-backgroundcolor py-2">
                    <div className="w-full flex justify-around rounded-xl">
                        <div className="p-5">Ván cờ mới</div>
                        <div className="p-5">Phân tích</div>
                        <div className="p-5">Kỳ thủ</div>
                        <div className="p-5">Các ván đâu</div>
                    </div>
                    <div className="w-full flex justify-around ">
                        <div className="w-1/2 text-center p-5 border-b-3 border-gray-500">Các nước đi</div>
                        <div className="w-1/2 text-center p-5 border-b border-gray-500">Thông tin</div>
                    </div>
                    <div className="w-full  p-5 min-h-[300px] max-h-[300px] overflow-y-auto text-white bg-black/30">
                        <div className=" flex flex-wrap">
                            {gameMoves.map((move, index) => (
                                <div
                                    key={`move-${move.id}`}
                                    className={`w-1/2 flex gap-2 py-1 justify-center ${move.mover?.id === me.myInformation.id && 'general-backgroundcolor'}`}
                                >
                                    <span className="font-medium">{move.mover?.name}:</span>
                                    <span>{move.lan}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex gap-2 px-5 mt-2">
                        <button
                            className="cursor-pointer font-bold w-1/2 p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]"

                        >
                            <AddIcon />
                            New game
                        </button>
                        <button
                            className="cursor-pointer font-bold w-1/2 p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]"

                        >
                            <RestartAlt />
                            Play again
                        </button>
                    </div>
                    <ChatBox me={me} queryClient={queryClient} socket={socket} gameId={id} />
                </div>
            </div>
        </div>
    )
}

export default Home