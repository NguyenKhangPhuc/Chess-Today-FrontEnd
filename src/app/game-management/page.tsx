'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from 'next/image';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import ExtensionIcon from '@mui/icons-material/Extension';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { getSocket } from '../libs/sockets';
import { ProfileAttributes } from '../types/types';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services';
import { timeSettings } from '../constants';

interface roomId {
    opponent: string,
    roomId: string,
    type: string,
}
const GameModePage = () => {
    const { data: me } = useQuery<ProfileAttributes, Error>({
        queryKey: ['current_user'],
        queryFn: getMe
    })
    const router = useRouter()
    const socket = getSocket()
    const [openSetting, setOpenSetting] = useState(false)
    const [timeSetting, setTimeSetting] = useState({
        title: '10 minutes',
        value: 600,
        mode: 'Rapid',
    })

    useEffect(() => {
        socket.on('match_found', (roomId: roomId) => {
            console.log(roomId)
            router.push(`/${roomId.type.toLowerCase()}/pvp/${roomId.roomId}`)
        })

    }, [router])
    const handleQuickMatch = (link: string) => {
        console.log(timeSetting)
        socket.emit('join_queue', link, me, timeSetting)
    }

    return (
        <div className='w-full scroll-smooth min-h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex flex-col  gap-10 text-white'>
                <div className='w-full  flex  justify-between rounded-xl'>
                    <div className='flex gap-2'>
                        <PersonIcon />
                        <div className='font-bold'>{me?.name}</div>
                    </div>
                    <div className='flex gap-2'>
                        <GroupsIcon />
                        <HelpIcon />
                        <SettingsIcon />
                    </div>
                </div>
                <div className='w-full h-auto flex gap-5'>
                    <Image src={'/assets/chessboard.png'} width={750} height={700} alt="Chessboard" className="rounded-lg shadow-lg"></Image>
                    <div className='w-full px-5 py-3 h-[750px] general-backgroundcolor flex flex-col gap-5 items-center overflow-y-auto'>
                        <div className='w-full flex'>
                            <div className='w-full flex flex-col items-center text-center justify-center'>
                                <LocalHospitalIcon sx={{ fontSize: 15 }} />
                                <div className='text-sm font-bold'>New match</div>
                            </div>
                            <div className='w-full flex flex-col items-center text-center justify-center'>
                                <PeopleIcon sx={{ fontSize: 15 }} />
                                <div className='text-sm font-bold'>People</div>
                            </div>
                        </div>
                        <div className='cursor-pointer w-full p-5 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' onClick={() => setOpenSetting(!openSetting)}>
                            <SelectAllIcon sx={{ fontSize: 40 }} />
                            <div className='font-bold text-lg'>{timeSetting.title} ({timeSetting.mode})</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowDownIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        {openSetting && <div className='w-full flex flex-col gap-3'>
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

                        </div>}

                        <button
                            className="cursor-pointer bg-[#6e3410]/80 w-full p-5 rounded-lg  font-bold text-xl hover:bg-[#6e3410]"
                            onClick={() => handleQuickMatch('Chess')}
                        >
                            Play Now!
                        </button>
                        <div className='w-full flex flex-col gap-2'>
                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <HandshakeIcon sx={{ fontSize: 30 }} />
                                <div className='font-bold text-lg'>Play To Learn With AI</div>
                            </div>
                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <ExtensionIcon sx={{ fontSize: 30 }} />
                                <div className='font-bold text-lg'>Play Puzzles</div>
                            </div>
                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <HandshakeIcon sx={{ fontSize: 30 }} />
                                <div className='font-bold text-lg'>Play With Friends</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameModePage