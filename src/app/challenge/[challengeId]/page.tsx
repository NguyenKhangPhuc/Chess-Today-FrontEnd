'use client'
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';
import Loader from "@/app/Components/Loader";
import { useEffect } from "react";
import { getSocket } from "@/app/libs/sockets";
import { RoomAttributes } from "@/app/services/room";
import { useGetChallengeById } from "@/app/hooks/query-hooks/useGetChallengeById";
import { Chessboard } from "react-chessboard";
const Home = () => {
    const { challengeId }: { challengeId: string } = useParams();
    const router = useRouter();
    const socket = getSocket();
    const { challenge, isChallengeLoading } = useGetChallengeById(challengeId)
    const handleSuccessfulMatchMaking = (roomId: RoomAttributes) => {
        console.log(roomId)
        router.push(`/chess/pvp/${roomId.roomId}`)
    }
    console.log(challenge, 'This is challenge')
    useEffect(() => {
        if (challenge) {
            socket.emit('waiting_challenge', challenge)
        }
        socket.on('match_found', handleSuccessfulMatchMaking)
        return () => {
            socket.off('match_found', handleSuccessfulMatchMaking)
        }
    }, [challenge])
    return (
        <div className="w-full scroll-smooth min-h-screen relative ">
            <div className={`max-w-7xl mx-auto h-full py-20 flex flex-col  gap-10 text-white`}>
                <div className='w-full h-auto flex flex-col xl:flex-row flex gap-5'>
                    <div className=' lg:h-[800px] md:h-[600px] flex flex-col items-center justify-between'>
                        <div className='lg:w-[710px] lg:h-[710px] md:w-[500px] md:h-[500px]'>
                            <Chessboard options={{

                                id: 'display',
                                boardStyle: { width: '100%', height: '100%' },

                            }} />
                        </div>
                    </div>
                    <div className='w-full px-5 py-3 h-[750px] general-backgroundcolor flex flex-col gap-5 items-center overflow-y-auto justify-center'>
                        <Loader />
                        <div className="text-[20px] font-semibold uppercase">Waiting for your friend</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home