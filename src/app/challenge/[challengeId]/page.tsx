'use client'
import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/Components/Loader";
import { useEffect } from "react";
import { getSocket } from "@/app/libs/sockets";
import { RoomAttributes } from "@/app/services/room";
import { useGetChallengeById } from "@/app/hooks/query-hooks/useGetChallengeById";
import { Chessboard } from "react-chessboard";

export const handleLeaveChallengePage = (challengeId: string) => {
    // Function to handle when user leave the challenge
    getSocket().emit('leave_challenge', { challengeId })
}

// Page for checking users who enter the challenge page
const Home = () => {
    // Get the challenge id from the route params
    const { challengeId }: { challengeId: string } = useParams();
    // Router to manage route with push/pop/replace/...
    const router = useRouter();
    // Get the socket to be able to emit
    const socket = getSocket();
    // Get the challenge info from its id
    const { challenge, isChallengeLoading } = useGetChallengeById(challengeId)

    const handleSuccessfulMatchMaking = (roomId: RoomAttributes) => {
        // Function to handle when both the users enter the challenge rooms
        // Move the user to the page where game start
        router.push(`/chess/pvp/${roomId.roomId}`)
    }
    useEffect(() => {
        if (challenge) {
            // Emit to notify that the user has entered the challenge
            socket.emit('waiting_challenge', challenge)
        }
        // Listen to the matchfound to know whether two users enter the page at the same time
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