'use client';
import { getSocket } from "@/app/libs/sockets";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useGetGameId } from "@/app/hooks/query-hooks/useGetGameId";
import { useGetGameMoves } from "@/app/hooks/query-hooks/useGetGameMoves";
import ChessPvpMemo from "@/app/Components/ChessPvP";
import GameSkeleton from "@/app/Components/GameSkeleton";
import { useGetAuthentication } from "@/app/hooks/query-hooks/useGetAuthentication";
import ChatBox from "./ChatBox";
import Link from "next/link";


// Page handling playing pvp chess game with other player, including chessboard, move history, messages box
const Home = () => {
    // Get the queryClient to invalidate queries
    const queryClient = useQueryClient()
    // Get the socket to be able to handle realtime gameplay/message
    const socket = getSocket()
    // Get the gameId from the params
    const { id }: { id: string } = useParams()
    useEffect(() => {
        // Function to handle when receive new message
        const handleNewGameMessage = () => {
            // Refetch to receive new message
            queryClient.invalidateQueries({ queryKey: [`game messages ${id}`] })
        }
        // Listen to new messages
        socket.on('announce_new_message', handleNewGameMessage)
        return () => {
            socket.off('announce_new_message', handleNewGameMessage)
        }
    }, [])
    // Get the user basic information
    const { authenticationInfo, isLoading } = useGetAuthentication();
    // Get the game data from its id
    const { data: game, isLoading: isGameLoading } = useGetGameId(id)
    // Get the game moves from the gameId
    const { data: gameMoves, isLoading: isGameMoveLoading } = useGetGameMoves(id)
    if (isLoading || isGameLoading || !game || !authenticationInfo || !gameMoves) return <GameSkeleton />

    const { userInfo: userData } = authenticationInfo;

    // If the current user id is not the same to both player -> show this div
    if (userData.id != game.player1Id && userData.id != game.player2Id) return (
        <div className="w-full text-center font-bold text-3xl uppercase text-white h-screen"> You are not allowed to view this page</div>
    )
    const me = {
        myInformation: userData.id === game.player1.id ? game.player1 : game.player2,
        opponent: userData.id === game.player1.id ? game.player2 : game.player1
    }
    return (
        <div className="w-full min-h-screen flex xl:flex-row flex-col items-center justify-center gap-5 bg-[#1a1917]">

            <ChessPvpMemo data={game} userData={userData} queryClient={queryClient} />


            <div className="xl:w-1/3 w-full flex flex-col rounded-2xl shadow-xl bg-[#1f1e1b] border border-[#2c2b29] overflow-hidden text-white">


                <div className="flex text-sm font-semibold uppercase tracking-wider border-b border-[#3a3937]">
                    <div className="w-1/2 text-center p-4 bg-[#302e2b] border-r border-[#3a3937] cursor-pointer hover:bg-[#3a3835] transition">
                        Moves
                    </div>
                    <div className="w-1/2 text-center p-4 bg-[#1f1e1b] cursor-pointer hover:bg-[#2a2926] transition">
                        Information
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
                    <Link href={'/game-management'} className="cursor-pointer w-1/2 py-3 bg-[#302e2b] hover:bg-[#454441] font-semibold rounded-lg flex items-center justify-center gap-2 transition">
                        <button

                        >
                            <AddIcon fontSize="small" />
                            New Game
                        </button>
                    </Link>

                    <Link href={'/game-management'} className="cursor-pointer w-1/2 py-3 bg-[#302e2b] hover:bg-[#454441] font-semibold rounded-lg flex items-center justify-center gap-2 transition">
                        <button

                        >
                            <AddIcon fontSize="small" />
                            Play Again
                        </button>
                    </Link>
                </div>

                <div className="mt-4 border-t border-[#3a3937]">
                    <ChatBox me={me} queryClient={queryClient} socket={socket} gameId={id} />
                </div>
            </div>
        </div>

    )
}

export default Home