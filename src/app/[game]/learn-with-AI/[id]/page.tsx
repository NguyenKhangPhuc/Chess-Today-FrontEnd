'use client';
import ChessPvP from "@/app/Components/ChessPvP";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import dayjs from 'dayjs'
import { RestartAlt } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import ChessboardCopmonent from "@/app/Components/Chessboard";
import { useEffect, useRef } from "react";
import { useMe } from "@/app/hooks/query-hooks/useMe";
import Loader from "@/app/Components/Loader";
import { useGetGameId } from "@/app/hooks/query-hooks/useGetGameId";
import { useGetGameMessage } from "@/app/hooks/query-hooks/useGetGameMessage";
import { useGetGameMoves } from "@/app/hooks/query-hooks/useGetGameMoves";

const Home = () => {
    const queryClient = useQueryClient()
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { id }: { game: string, id: string } = useParams()
    const { me: userData, isLoading } = useMe();
    const { data: game, isLoading: isGameLoading } = useGetGameId(id);

    const { data: gameMessages, isLoading: isMessageLoading } = useGetGameMessage(id)

    const { data: gameMoves, isLoading: isGameMovesLoading } = useGetGameMoves(id)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom() }, [gameMessages])

    if (isLoading || isGameLoading || !game || !userData || !gameMoves || isMessageLoading) return (
        <div className="w-full h-screen bg-black flex justify-center items-center"><Loader /></div>
    )
    const me = {
        myId: userData.id,
        opponent: userData.id === game.player1.id ? game.player2 : game.player1
    }
    console.log('This is game message', gameMessages)
    return (
        <div className="w-full min-h-screen flex  items-center gap-5">
            <ChessboardCopmonent data={game} userData={userData} queryClient={queryClient} />
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
                                    className={`w-1/2 flex gap-2 py-1 justify-center ${move.mover?.id === me.myId && 'general-backgroundcolor'}`}
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
                    <div className="w-full flex flex-col p-5 h-[300px]">
                        <div className="font-bold text-xl pb-5">Talk to {me.opponent.name}</div>
                        <div className="w-full flex flex-col max-h-2/3 gap-2 min-h-3/4 overflow-y-auto bg-black/30">
                            {gameMessages?.map((e) => {
                                return (
                                    <div className={`w-full p-5 flex flex-col ${e.senderId === me.myId ? 'items-end' : 'items-start'}`} key={`Message ${e.content}`}>
                                        <div className="text-[12px] font-light opacity-70">
                                            {e.createdAt && dayjs(e.createdAt).format('DD/MM/YY HH:mm:ss')} * {e.senderId === me.myId ? userData.name : me.opponent.name}
                                        </div>
                                        <div className={`min-w-1/4 max-w-1/2 text-white p-2 break-words rounded-xl ${e.senderId === me.myId ? 'bg-[#302e2b]' : 'bg-black'}`}>
                                            {e.content}
                                        </div>

                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home