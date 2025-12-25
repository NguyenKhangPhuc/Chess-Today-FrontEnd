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
import GameSkeleton from "@/app/Components/GameSkeleton";

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

    if (isLoading || isGameLoading || !game || !userData || !gameMoves || isMessageLoading) return <GameSkeleton />
    const me = {
        myId: userData.id,
        opponent: userData.id === game.player1.id ? game.player2 : game.player1
    }
    console.log('This is game message', gameMessages)
    return (
        <div className="w-full min-h-screen flex xl:flex-row flex-col items-center gap-5">
            <ChessboardCopmonent data={game} userData={userData} queryClient={queryClient} />

            <div className="xl:w-1/3 w-full flex flex-col rounded-2xl shadow-xl bg-[#1f1e1b] border border-[#2c2b29] overflow-hidden text-white">
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


                    <div className="font-bold text-xl pb-4">
                        Engine Evaluation
                    </div>


                    <div className="w-full flex flex-col gap-3 overflow-y-auto bg-black/30 p-4 rounded-lg">

                        {gameMessages?.map((e) => {
                            return (
                                <div
                                    key={`Message ${e.id}`}
                                    className="w-full bg-black/40 rounded-lg p-4 flex flex-col border border-white/5"
                                >


                                    <div className="flex justify-between items-center text-[11px] opacity-60 pb-2">
                                        <span>
                                            {e.createdAt &&
                                                dayjs(e.createdAt).format('DD/MM/YY HH:mm:ss')
                                            }
                                        </span>

                                        <span>
                                            {e.senderId === me.myId
                                                ? userData.name
                                                : me.opponent.name
                                            }
                                        </span>
                                    </div>


                                    <div className="text-[13px] text-white break-words leading-relaxed">
                                        {e.content}
                                    </div>

                                </div>
                            );
                        })}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home