'use client'
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';
import Loader from "@/app/Components/Loader";
import { useQuery } from "@tanstack/react-query";
import { getChallengeById } from "@/app/services/challenge";
import { useMe } from "@/app/hooks/query-hooks/useMe";
import { useEffect } from "react";
import { getSocket } from "@/app/libs/sockets";
import { RoomAttributes } from "@/app/services/room";
import { useGetChallengeById } from "@/app/hooks/query-hooks/useGetChallengeById";
const Home = () => {
    const { challengeId }: { challengeId: string } = useParams();
    const router = useRouter();
    const { me } = useMe();
    const socket = getSocket();
    const { challenge, isChallengeLoading } = useGetChallengeById(challengeId)
    const handleSuccessfulMatchMaking = (roomId: RoomAttributes) => {
        console.log(roomId)
        router.push(`/${roomId.type.toLowerCase()}/pvp/${roomId.roomId}`)
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
                <div className='w-full h-auto flex gap-5'>
                    <Image src={'/assets/chessboard.png'} width={750} height={700} alt="Chessboard" className="rounded-lg shadow-lg" />
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