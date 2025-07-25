'use client'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Link from 'next/link';
import socket from '@/app/sockets';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
        <div className='w-full scroll-smooth h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex flex-col items-center gap-10 text-white'>
                <div className="text-4xl font-bold">Game Modes Management</div>
                <div className="grid grid-cols-3 gap-5">
                    <Link href={`/game-mode/chess/play-with-ai`} className='w-full'>
                        <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                            <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                            <div className='font-bold text-xl'>Play with AI</div>
                            <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                        </div>
                    </Link>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5" onClick={() => handleMatch()}>
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Match Making</div>
                        <div className='text-center'>Find and Challenge another person</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameModePage