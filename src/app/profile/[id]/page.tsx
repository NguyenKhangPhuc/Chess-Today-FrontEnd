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
import { ProfileAttributes } from "@/app/types/user";
import { GAME_TYPE } from "@/app/types/enum";
import { PageParam } from "@/app/types/types";
import ProfileSkeleton from "../skeleton";
import { getSocket } from "@/app/libs/sockets";
import { useParams, useRouter } from "next/navigation";
import FriendList from "@/app/Components/FriendList";
import { useGetGames } from "@/app/hooks/query-hooks/useGetGames";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useGetSpecificUserInfo } from "@/app/hooks/query-hooks/useGetSpecificUserInfo";
import GameHistory from "./GameHistory";



// Page to show the profile page of the user
const Home = () => {
    // Query client to invalidate the query
    const queryClient = useQueryClient()
    // State to manage change between Friendlist component and GameHistory component
    const [option, setOption] = useState('overview')
    // Get the userid from the params
    const { id }: { id: string } = useParams();
    // Get the user information by the userid above
    const { userInfo, isLoading } = useGetSpecificUserInfo(id);
    // Socket to handle real-time stuffs
    const socket = getSocket()
    // Route to handle route management
    const router = useRouter();
    if (isLoading || !userInfo) return <ProfileSkeleton />
    const friendlist = [...userInfo.friends, ...userInfo.friendOf]
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
        if (winnerId === userInfo.id) {
            return <EmojiEventsIcon />
        }
        if (winnerId === null) {
            return <BalanceIcon />
        }
        if (winnerId !== userInfo.id) {
            return <GppBadIcon />
        }
    }

    return (
        <div className='w-full scroll-smooth min-h-screen'>

            <div className='max-w-7xl mx-auto py-10 flex flex-col gap-10 text-white'>
                <div className="w-full flex flex-col general-backgroundcolor ">
                    <div className="w-full flex sm:flex-row flex-col gap-5 border-b border-gray-500 p-5 ">
                        <div className='sm:w-45 sm:h-45 w-full h-full p-5 bg-gray-200 rounded-lg flex items-center justify-center'>
                            <Person2 sx={{ color: 'black', fontSize: 80 }} />
                        </div>
                        <div className="sm:w-auto w-full flex-1 flex flex-col justify-between sm:items-start items-center">
                            <div className="sm:w-auto w-full flex flex-col gap-2 ">
                                <div className="font-bold text-white text-2xl">{userInfo.name}</div>
                                <div className="w-full flex gap-5">
                                    <div className="text-base flex font-semibold gap-1"><div className="opacity-60">Joined</div> {dayjs(userInfo.createdAt).format('DD/MM/YY')}</div>
                                    <div className="text-base flex font-semibold gap-1"><div className="opacity-60">Friends</div> {friendlist.length}</div>
                                </div>
                            </div>
                            <div className='cursor-pointer sm:w-[200px] w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <div className='font-bold text-base'>Update Profile</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex gap-2">
                        <div className={`cursor-pointer p-5 font-bold ${option === 'overview' && 'border-b-4 border-[#6e3410]'}`} onClick={() => setOption('overview')}>Overview</div>
                        <div className={`cursor-pointer p-5 font-bold ${option === 'friendList' && 'border-b-4 border-[#6e3410]'}`} onClick={() => setOption('friendList')}>Friends</div>
                    </div>
                </div>
                <div className="lg:w-2/3 w-full grid grid-cols-3 gap-5">
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center  gap-2">
                        <RocketIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Rocket</div>
                        <div className="text-[#6e3410] font-bold text-xl">{userInfo.rocketElo}</div>
                    </div>
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center  gap-2">
                        <BoltIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Blitz</div>
                        <div className="text-[#6e3410] font-bold text-xl">{userInfo.blitzElo}</div>
                    </div>
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center gap-2">
                        <SpeedIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Rapid</div>
                        <div className="text-[#6e3410] font-bold text-xl">{userInfo.elo}</div>
                    </div>
                </div>
                <GameHistory userInfo={userInfo} handleIconType={handleIconType} handleResultIcon={handleResultIcon} isAvailable={option === 'overview'} router={router} />
                {option === 'friendList' && <div className="lg:w-2/3 w-full flex flex-col general-backgroundcolor p-5 gap-5">
                    <FriendList userInfo={userInfo} isAvailable={option === 'friendList'} queryClient={queryClient} socket={socket} router={router} />
                </div>}
            </div>
        </div>
    )
}

export default Home