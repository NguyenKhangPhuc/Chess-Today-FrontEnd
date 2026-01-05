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
import { timeSettings } from '../constants';
import Loader from '../Components/Loader';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { useCreateBotGame } from '../hooks/mutation-hooks/useCreateBotGame';
import { useCheckOngoingGame } from '../hooks/mutation-hooks/useCheckOngoingGame';
import { ChallengeAttributes } from '../types/challenge';
import { RoomAttributes } from '../services/room';
import { Chessboard } from 'react-chessboard';
import GameManagementSkeleton from './skeleton';
import { useMe } from '../hooks/query-hooks/useMe';
import { AxiosError } from 'axios';
import { GameAttributes } from '../types/game';
import { useNotification } from '../contexts/NotificationContext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Page to manage game choosing and matching player
const GameModePage = () => {
    // Manage the route
    const router = useRouter()
    // Socket to handle real-time stuffs
    const socket = getSocket()
    // Manage the notification
    const { showNotification } = useNotification();
    // State to open/close the settings box for matchmaking
    const [openSetting, setOpenSetting] = useState(false)
    // State to know whether the users is having a match making
    const [isMatchMaking, setIsMatchMaking] = useState(false);
    // Manage the time settings chosen by the user
    const [timeSetting, setTimeSetting] = useState({
        title: '10 minutes',
        value: 600,
        mode: 'Rapid',
    })
    // State to manage open bot setting
    const [botSetting, setBotSetting] = useState(false);
    // State to manage board side of bot setting
    const [botBoardSide, setBotBoardSide] = useState<'white' | 'black'>('white')
    // Get the user full information not including password and only join friendship tables
    const { me, isLoading } = useMe();
    // Mutation to create the bot game
    const { createNewBotGameMutation } = useCreateBotGame({ router, setIsMatchMaking })
    // Mutation to check the ongoing-match 
    const { checkOngoingGameMutation } = useCheckOngoingGame();
    useEffect(() => {
        // Function to handle exit queue when the user reload or close tab
        const handleBeforeUnload = () => {
            socket.emit("exit_queue", timeSetting);
        };
        // Listen to the event
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    useEffect(() => {
        // Push the user to the gameplay if the server match the user successfully
        const handleSuccessfulMatchMaking = (roomId: RoomAttributes) => {
            // Move the user to the specific route
            router.push(`/chess/pvp/${roomId.roomId}`)
        }
        // Handle exiting the queue
        const handleSuccessExitQueue = () => {
            setIsMatchMaking(false);
        }
        // Create the listener
        socket.on('match_found', handleSuccessfulMatchMaking)
        // Create the listener
        socket.on('exit_queue', handleSuccessExitQueue)
        return () => {
            socket.off('match_found', handleSuccessfulMatchMaking)
            socket.off('exit_queue', handleSuccessExitQueue)
        }
    }, [router])


    // Function to handle finding a match
    const handleQuickMatch = async (link: string) => {
        try {
            // Check if there are currently ongoing game
            const data = await checkOngoingGameMutation.mutateAsync();
            // If not -> join the queue
            socket.emit('join_queue', me, timeSetting)
            setIsMatchMaking(true)
        } catch (error) {
            // Check if the error is the correct error code
            // If yes -> move the user to the ongoing-game
            let message = 'Unknown Error';
            if (error instanceof AxiosError) {
                message = error.response?.data.error || 'Unknown error';
                const errorCode = error.response?.data.errorCode
                if (errorCode == 'GAME_IN_PROGRESS') {
                    const gameInfo: GameAttributes = error.response?.data.game;
                    router.push(`/chess/pvp/${gameInfo.id}`)
                }
            }
            showNotification(message)
        }
    }
    // Function to create a bot game
    const handleMatchWithBot = () => {
        createNewBotGameMutation.mutate(botBoardSide)
    }
    // Function to handle exit queue
    const handleExitQueue = () => {
        socket.emit('exit_queue', timeSetting)
    }
    // Function to handle go to puzzles page
    const handleGoToPuzzlePage = () => {
        router.push('/puzzles');
    }
    // 
    if (!me || isLoading) return (
        <div className="w-full bg-[#302e2b]"><GameManagementSkeleton /></div>
    )

    return (
        <div className={`w-full scroll-smooth min-h-screen relative`}>
            {isMatchMaking && <div className='absolute w-full h-screen flex flex-col justify-center items-center z-10'>
                <div className='cursor-pointer flex gap-1 text-lg font-semibold items-center text-white general-backgroundcolor py-2 px-5 rounded-lg hover:opacity-80' onClick={() => handleExitQueue()}>
                    <CancelPresentationIcon />
                    <div>Quit</div>
                </div>
                <Loader />
                <div className='font-bold text-3xl text-white'>Match making</div>
            </div>}
            <div className={`max-w-7xl mx-auto py-10 flex flex-col  gap-10 text-white  ${isMatchMaking && 'opacity-50'}`}>
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
                <div className="w-full h-auto flex flex-col xl:flex-row gap-5">
                    <div className=' lg:h-[800px] md:h-[600px] flex flex-col items-center justify-between'>
                        <div className='lg:w-[710px] lg:h-[710px] md:w-[500px] md:h-[500px]'>
                            <Chessboard options={{

                                id: 'display',
                                boardStyle: { width: '100%', height: '100%' },

                            }} />
                        </div>
                    </div>
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
                            className="cursor-pointer bg-[#6e3410]/80 w-full p-5 font-bold text-xl hover:bg-[#6e3410]"
                            onClick={() => handleQuickMatch('Chess')}
                        >
                            Play Now!
                        </button>
                        <div className='w-full flex flex-col gap-2 cursor-pointer'>
                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' onClick={() => setBotSetting(!botSetting)}>
                                <HandshakeIcon sx={{ fontSize: 30 }} />
                                <div className='font-bold text-lg'>Play To Learn With AI</div>
                                <div className='absolute right-5'>
                                    <KeyboardArrowDownIcon sx={{ fontSize: 30 }} />
                                </div>
                            </div>
                            {botSetting && <div className='w-full flex flex-col gap-2 pb-5'>
                                <div className='w-full flex gap-2'>
                                    <RestartAltIcon sx={{ fontSize: 20 }} />
                                    <div className='font-bold text-base'>Board Side</div>
                                </div>

                                <div
                                    className={`w-full flex items-center text-center justify-center ${botBoardSide == 'white' ? 'bg-[#454441]' : 'bg-[#302e2b]'} p-3 rounded-lg cursor-pointer font-bold uppercase`}
                                    onClick={() => setBotBoardSide(botBoardSide == 'white' ? 'black' : 'white')}
                                >
                                    {botBoardSide == 'white' ? 'White side' : 'black side'}
                                </div>
                                <button
                                    className="cursor-pointer bg-[#6e3410]/80 w-full p-5 font-bold text-xl hover:bg-[#6e3410]"
                                    onClick={() => handleMatchWithBot()}
                                >
                                    Play With AI Now!
                                </button>
                            </div>}
                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' onClick={() => handleGoToPuzzlePage()}>
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