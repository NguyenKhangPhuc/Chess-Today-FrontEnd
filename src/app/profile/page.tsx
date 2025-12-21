'use client'
import { Person2 } from "@mui/icons-material"
import RocketIcon from '@mui/icons-material/Rocket';
import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import GppBadIcon from '@mui/icons-material/GppBad';
import BalanceIcon from '@mui/icons-material/Balance';
import dayjs from "dayjs";
import { ReactNode, useState } from "react";
import FriendList from "../Components/FriendList";
import { PageParam } from "../types/types";
import { ProfileAttributes } from "../types/user";
import { GAME_TYPE } from "../types/enum";
import Loader from "../Components/Loader";
import { useMe } from "../hooks/query-hooks/useMe";
import { useGetGames } from "../hooks/query-hooks/useGetGames";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getSocket } from "../libs/sockets";

const GameHistory = ({ me, handleIconType, handleResultIcon, isAvailable, router }: { me: ProfileAttributes, handleIconType: (gameType: GAME_TYPE) => ReactNode, handleResultIcon: (winnerId: string | null) => ReactNode, isAvailable: boolean, router: AppRouterInstance }) => {
    const [cursor, setCursor] = useState<PageParam>();
    const { data: games, isLoading } = useGetGames({ userId: me.id, cursor })
    console.log(games)
    if (!isAvailable) return
    console.log(cursor)
    const handleNavigateGameHistory = (id: string) => {
        router.push(`/history/${id}`);
    }
    return (
        <div className="w-2/3 flex flex-col general-backgroundcolor">
            <div className="font-semibold py-2 px-5">Game History</div>
            <div className="w-full grid grid-cols-4 px-5 py-2 font-semibold bg-[#454441]">
                <div className="w-full">
                    Player
                </div>
                <div className="w-full">Result</div>
                <div className="w-full">Moves</div>
                <div className="w-full">Date</div>
            </div>

            {games?.data.map((e) => {
                return (
                    <div className="w-full grid grid-cols-4 px-5 py-2 font-semibold border-t border-gray-500 hover:opacity-50 cursor-pointer" key={`game ${e.id}`} onClick={() => handleNavigateGameHistory(e.id)}>
                        <div className="w-full flex items-center gap-2">
                            {handleIconType(e.gameType)}
                            <div className="flex flex-col">
                                <div className="w-full">{e.player1.name}</div>
                                <div className="w-full break-all">{e.player2.name}</div>
                            </div>
                        </div>
                        <div className="w-full">{handleResultIcon(e.winnerId)}</div>
                        <div className="w-full">{e.moveHistory.length}</div>
                        <div className="w-full">{dayjs(e.updatedAt).format('DD/MM/YY')}</div>
                    </div>
                )
            })}
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

const Home = () => {
    const queryClient = useQueryClient()
    const [option, setOption] = useState('overview')
    const { me, isLoading } = useMe();
    const socket = getSocket()
    const router = useRouter();
    if (isLoading || !me) return (
        <div className="w-full h-screen bg-black flex justify-center items-center"><Loader /></div>
    )
    console.log([...me.gameAsPlayer1, ...me.gameAsPlayer2].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    const friendlist = [...me.friends, ...me.friendOf]
    const handleIconType = (gameType: GAME_TYPE) => {
        switch (gameType) {
            case GAME_TYPE.RAPID:
                return <SpeedIcon sx={{ fontSize: 40 }} />
            case GAME_TYPE.BLITZ:
                return <BoltIcon sx={{ fontSize: 40 }} />
            case GAME_TYPE.ROCKET:
                return <RocketIcon sx={{ fontSize: 40 }} />
            default:
                return
        }
    }
    const handleResultIcon = (winnerId: string | null) => {
        if (winnerId === me.id) {
            return <EmojiEventsIcon />
        }
        if (winnerId === null) {
            return <BalanceIcon />
        }
        if (winnerId !== me.id) {
            return <GppBadIcon />
        }
    }
    return (
        <div className='w-full scroll-smooth min-h-screen'>

            <div className='max-w-7xl mx-auto py-10 flex flex-col gap-10 text-white'>
                <div className="w-full flex flex-col general-backgroundcolor ">
                    <div className="w-full flex gap-5 border-b border-gray-500 p-5">
                        <div className='w-45 h-45 p-5 bg-gray-200 rounded-lg flex items-center justify-center'>
                            <Person2 sx={{ color: 'black', fontSize: 80 }} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="font-bold text-white text-2xl">{me.name}</div>
                                <div className="w-full flex gap-5">
                                    <div className="text-base flex font-semibold gap-1"><div className="opacity-60">Joined</div> {dayjs(me.createdAt).format('DD/MM/YY')}</div>
                                    <div className="text-base flex font-semibold gap-1"><div className="opacity-60">Friends</div> {friendlist.length}</div>
                                </div>
                            </div>
                            <div className='cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <div className='font-bold text-base'>Update Profile</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex gap-2">
                        <div className={`cursor-pointer p-5 font-bold ${option === 'overview' && 'border-b-4 border-[#6e3410]'}`} onClick={() => setOption('overview')}>Overview</div>
                        <div className={`cursor-pointer p-5 font-bold ${option === 'friendList' && 'border-b-4 border-[#6e3410]'}`} onClick={() => setOption('friendList')}>Friends</div>
                    </div>
                </div>
                <div className="w-2/3 grid grid-cols-3 gap-5">
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center  gap-2">
                        <RocketIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Rocket</div>
                        <div className="text-[#6e3410] font-bold text-xl">{me.rocketElo}</div>
                    </div>
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center  gap-2">
                        <BoltIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Blitz</div>
                        <div className="text-[#6e3410] font-bold text-xl">{me.blitzElo}</div>
                    </div>
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center gap-2">
                        <SpeedIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Rapid</div>
                        <div className="text-[#6e3410] font-bold text-xl">{me.elo}</div>
                    </div>
                </div>
                <GameHistory me={me} handleIconType={handleIconType} handleResultIcon={handleResultIcon} isAvailable={option === 'overview'} router={router} />
                {option === 'friendList' && <div className="w-2/3 flex flex-col general-backgroundcolor p-5 gap-5">
                    <FriendList me={me} isAvailable={option === 'friendList'} queryClient={queryClient} socket={socket} router={router} />
                </div>}
            </div>
        </div>
    )
}

export default Home