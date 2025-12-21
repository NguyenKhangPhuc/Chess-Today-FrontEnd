import { QueryClient, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Person2 } from "@mui/icons-material"
import GamesIcon from '@mui/icons-material/Games';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { PageParam } from "../types/types";
import { ProfileAttributes } from "../types/user";
import { useDeleteFriendShip } from "../hooks/mutation-hooks/useDeleteFriendShip";
import { useGetFriends } from "../hooks/query-hooks/useGetFriends";
import { timeSettings } from "../constants";
import { createChallenge } from "../services/challenge";
import { ChallengeAttributes } from "../types/challenge";
import { GAME_TYPE, INVITATION_STATUS } from "../types/enum";
import { Socket } from "socket.io-client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { FriendShipAttributes } from "../types/friend";
import { useCreateNewChallenge } from "../hooks/mutation-hooks/useCreateNewChallenge";

const FriendList = ({ me, isAvailable, queryClient, socket, router }: { me: ProfileAttributes, isAvailable: boolean, queryClient: QueryClient, socket: Socket, router: AppRouterInstance }) => {
    const [cursor, setCursor] = useState<PageParam | undefined>()
    const { data, isLoading } = useGetFriends({ cursor, me })
    const [chosenOpenChallenge, setChosenOpenChallenge] = useState<number | undefined>();
    const [isOpenChallengeBox, setIsOpenChallengeBox] = useState(false);
    const [timeSetting, setTimeSetting] = useState({
        title: '10 minutes',
        value: 600,
        mode: GAME_TYPE.RAPID,
    })
    const [boardSideSetting, setBoardSideSetting] = useState(false)
    const { deleteFriendShipMutation } = useDeleteFriendShip(queryClient)
    const { createChallengeMutation } = useCreateNewChallenge({ socket: socket, router: router })
    const handleDeleteFriendShip = (friendShipId: string) => {
        console.log(friendShipId)
        deleteFriendShipMutation.mutate(friendShipId)
    }

    const handleOpenChallengeBox = (index: number) => {
        setChosenOpenChallenge(index)
        setIsOpenChallengeBox(!isOpenChallengeBox)
    }

    const handleCreateChallenge = (friendship: FriendShipAttributes) => {
        const friendId = friendship.friendId == me.id ? friendship.userId : friendship.friendId
        const newChallenge: ChallengeAttributes = {
            senderId: me.id,
            receiverId: friendId,
            status: INVITATION_STATUS.PENDING,
            gameType: timeSetting.mode,
            isSenderPlayer1: boardSideSetting,
            playerTime: timeSetting.value
        }
        console.log(newChallenge)
        createChallengeMutation.mutate(newChallenge);
    }
    if (!isAvailable) return null
    return (
        <>
            {data?.data.map((e, index) => {
                return (
                    <div key={`$friends ${e.id}`} className="w-full flex flex-col">
                        <div className='w-full flex gap-5 items-center justify-between' >
                            <div className='flex items-center gap-5'>
                                <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                                    <Person2 sx={{ color: 'black' }} />

                                </div>
                                <div className='font-bold'>{me.id === e.userId ? e.friend?.name : e.user?.name}</div>
                            </div>
                            <div className='flex gap-5'>
                                <div className='flex justify-center items-center' onClick={() => handleOpenChallengeBox(index)}><GamesIcon sx={{ fontSize: 20 }} className='cursor-pointer opacity-70 hover:opacity-100 duration-300' /></div>
                                <div className='flex justify-center items-center'><ForwardToInboxIcon sx={{ fontSize: 20 }} className='cursor-pointer opacity-70 hover:opacity-100 duration-300' /></div>
                                <div className='flex justify-center items-center' onClick={() => handleDeleteFriendShip(e.id)}><DeleteIcon sx={{ fontSize: 20 }} className='cursor-pointer opacity-70 hover:opacity-100 duration-300' /></div>
                            </div>
                        </div>

                        {isOpenChallengeBox && chosenOpenChallenge == index && <div className='w-full flex flex-col gap-3 p-5'>
                            <div className='cursor-pointer w-full p-5 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <SelectAllIcon sx={{ fontSize: 40 }} />
                                <div className='font-bold text-lg'>{timeSetting.title} ({timeSetting.mode})</div>
                                <div className='absolute right-5'>
                                    <KeyboardArrowDownIcon sx={{ fontSize: 30 }} />
                                </div>
                            </div>
                            {timeSettings.map((e) => {
                                return (
                                    <div className='w-full flex flex-col gap-1' key={`${e.title}`}>
                                        <div className='w-full flex gap-2'>
                                            {e.icon}
                                            <div className='font-bold text-base'>{e.title}</div>
                                        </div>
                                        <div className='flex gap-2 text-sm font-bold'>
                                            {
                                                e.options.map(option => {
                                                    return (
                                                        <div key={`${option.title}`}
                                                            className={`w-1/3 flex items-center text-center justify-center bg-[#302e2b] hover:bg-[#454441] p-3 rounded-lg cursor-pointer ${timeSetting.title === option.title ? 'bg-[#454441]' : 'bg-[#302e2b]'}`}
                                                            onClick={() => setTimeSetting({ ...option, mode: e.title })}
                                                        >
                                                            {option.title}
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                )
                            })}
                            <div className='w-full flex flex-col gap-1'>
                                <div className='w-full flex gap-2'>
                                    <RestartAltIcon sx={{ fontSize: 20 }} />
                                    <div className='font-bold text-base'>Board Side</div>
                                </div>

                                <div
                                    className={`w-full flex items-center text-center justify-center ${boardSideSetting ? 'bg-[#454441]' : 'bg-[#302e2b]'} p-3 rounded-lg cursor-pointer font-bold uppercase`}
                                    onClick={() => setBoardSideSetting(!boardSideSetting)}
                                >
                                    {boardSideSetting ? 'White side' : 'black side'}
                                </div>

                            </div>
                            <button
                                className="cursor-pointer bg-[#6e3410]/80 w-full p-3 font-bold text-xl hover:bg-[#6e3410]"
                                onClick={() => handleCreateChallenge(e)}
                            >
                                Challenge!
                            </button>
                        </div>
                        }

                    </div>
                )
            })}
            <div className="w-full flex gap-5 justify-end ">
                <button
                    disabled={data?.hasPrevPage !== undefined ? !data.hasPrevPage : true}
                    className={`${data?.hasPrevPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ before: data?.prevCursor, after: undefined })}
                >
                    <div className='font-bold text-base'>Previous Page</div>
                </button>
                <button
                    disabled={data?.hasNextPage !== undefined ? !data.hasNextPage : true}
                    className={`${data?.hasNextPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ after: data?.nextCursor, before: undefined })}>
                    <div className='font-bold text-base'>Next Page</div>
                </button>
            </div>
        </>
    )
}

export default FriendList