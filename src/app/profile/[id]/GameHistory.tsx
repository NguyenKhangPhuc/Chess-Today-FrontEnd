import { useGetGames } from "@/app/hooks/query-hooks/useGetGames";
import { GAME_TYPE } from "@/app/types/enum";
import { PageParam } from "@/app/types/types";
import { ProfileAttributes } from "@/app/types/user";
import dayjs from "dayjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReactNode, useState } from "react";

// Game history component, including the user's game history details
const GameHistory = ({ userInfo, handleIconType, handleResultIcon, isAvailable, router }: { userInfo: ProfileAttributes, handleIconType: (gameType: GAME_TYPE) => ReactNode, handleResultIcon: (winnerId: string | null) => ReactNode, isAvailable: boolean, router: AppRouterInstance }) => {
    // Cursor to manage the game data currentPage
    const [cursor, setCursor] = useState<PageParam>();
    // Get all the games by the userID and page by the cursor
    const { data: games, isLoading } = useGetGames({ userId: userInfo.id, cursor })
    if (!isAvailable) return
    // Navigate to a specific game history
    const handleNavigateGameHistory = (id: string) => {
        router.push(`/history/${id}`);
    }
    return (
        <div className="lg:w-3/4 w-full flex flex-col general-backgroundcolor">
            <div className="font-semibold py-2 px-5">Game History</div>
            <div className="w-full overflow-x-auto">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-2 font-semibold bg-[#454441] whitespace-nowrap">
                        <div className="w-full whitespace-nowrap">
                            Player
                        </div>
                        <div className="w-full whitespace-nowrap">Result</div>
                        <div className="w-full whitespace-nowrap">Moves</div>
                        <div className="w-full whitespace-nowrap">Date</div>
                    </div>
                </div>


                <div className="min-w-[900px]">
                    {games?.data.map((e) => {
                        return (
                            <div
                                key={`game ${e.id}`}
                                onClick={() => handleNavigateGameHistory(e.id)}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-2 font-semibold border-t border-gray-500 hover:opacity-50 cursor-pointer whitespace-nowrap"
                            >
                                <div className="w-full flex items-center gap-2">
                                    {handleIconType(e.gameType)}
                                    <div className="flex flex-col">
                                        <div className="whitespace-nowrap">{e.player1.name}</div>
                                        <div className="whitespace-nowrap">{e.player2.name}</div>
                                    </div>
                                </div>

                                <div className="w-full whitespace-nowrap">
                                    {handleResultIcon(e.winnerId)}
                                </div>

                                <div className="w-full whitespace-nowrap">
                                    {e.moveHistory.length}
                                </div>

                                <div className="w-full whitespace-nowrap">
                                    {dayjs(e.updatedAt).format('DD/MM/YY')}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex gap-5 justify-end p-5">
                <button
                    disabled={games?.hasPrevPage !== undefined ? !games.hasPrevPage : true}
                    className={`${games?.hasPrevPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ before: games?.prevCursor, after: undefined })}
                >
                    <div className='font-bold text-base'>Previous Page</div>
                </button>
                <button
                    disabled={games?.hasNextPage !== undefined ? !games.hasNextPage : true}
                    className={`${games?.hasNextPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ after: games?.nextCursor, before: undefined })}>
                    <div className='font-bold text-base'>Next Page</div>
                </button>
            </div>

        </div>
    )
}
export default GameHistory