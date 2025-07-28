'use client'

import Link from 'next/link';
import socket from '@/app/sockets';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from 'next/image';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExtensionIcon from '@mui/icons-material/Extension';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import HandshakeIcon from '@mui/icons-material/Handshake';
interface roomId {
    opponent: string,
    roomId: string,
}
const GameModePage = () => {
    const router = useRouter()

    useEffect(() => {
        socket.on('match_found', (roomId: roomId) => {
            console.log(roomId)
            router.push(`/game-mode/pvp/${roomId.roomId}`)
        })

    }, [router])
    const handleMatch = () => {
        socket.emit('join_queue', socket.id)
    }
    return (
        <div className='w-full scroll-smooth min-h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex flex-col  gap-10 text-white'>
                <div className='w-full  flex  justify-between rounded-xl'>
                    <div className='flex gap-2'>
                        <PersonIcon />
                        <div className='font-bold'>nkppppooo</div>
                    </div>
                    <div className='flex gap-2'>
                        <GroupsIcon />
                        <HelpIcon />
                        <SettingsIcon />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <div className='w-full general-backgroundcolor p-5 flex gap-5 rounded-xl'>
                        <Image src={'/assets/chessboard.png'} width={300} height={400} alt="Chessboard" className="rounded-lg shadow-lg"></Image>
                        <div className='w-full flex flex-col justify-between items-center p-5'>
                            <button
                                className="flex justify-start text-left gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <RocketLaunchIcon />
                                Quick Match
                            </button>
                            <button
                                className="flex justify-start text-left gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <PrecisionManufacturingIcon />
                                Learn with AI
                            </button>
                            <button
                                className="flex justify-start text-left gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <ExtensionIcon />
                                Puzzels
                            </button>

                            <button
                                className="flex justify-start text-left gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <HandshakeIcon />
                                Play with Friends
                            </button>
                        </div>
                    </div>
                    <div className='w-full general-backgroundcolor p-5 flex gap-5'>
                        <Image src={'/assets/caroboard.png'} width={300} height={200} alt="Chessboard" className="rounded-lg shadow-lg" />
                        <div className='w-full flex flex-col justify-between items-center p-5'>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <RocketLaunchIcon />
                                Quick Match
                            </button>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <PrecisionManufacturingIcon />
                                Learn with AI
                            </button>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <ExtensionIcon />
                                Puzzels
                            </button>

                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <HandshakeIcon />
                                Play with Friends
                            </button>
                        </div>
                    </div>
                    <div className='w-full general-backgroundcolor p-5 gap-5 flex'>
                        <Image src={'/assets/chinesechessboard.png'} width={300} height={200} alt="Chessboard" className="rounded-lg shadow-lg " />
                        <div className='w-full flex flex-col justify-between items-center p-5'>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <RocketLaunchIcon />
                                Quick Match
                            </button>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <PrecisionManufacturingIcon />
                                Learn with AI
                            </button>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <ExtensionIcon />
                                Puzzels
                            </button>

                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <HandshakeIcon />
                                Play with Friends
                            </button>
                        </div>
                    </div>
                    <div className='w-full general-backgroundcolor p-5 gap-5 flex'>
                        <Image src={'/assets/goboard.png'} width={300} height={200} alt="Chessboard" className="rounded-lg shadow-lg" />
                        <div className='w-full flex flex-col justify-between items-center p-5'>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <RocketLaunchIcon />
                                Quick Match
                            </button>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <PrecisionManufacturingIcon />
                                Learn with AI
                            </button>
                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <ExtensionIcon />
                                Puzzels
                            </button>

                            <button
                                className="flex justify-start gap-3 cursor-pointer bg-[#302e2b] w-full p-4 rounded-lg shadow-xl/30 font-bold text-base hover:-translate-y-2 hover:scale-105 duration-300"

                            >
                                <HandshakeIcon />
                                Play with Friends
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameModePage