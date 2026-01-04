'use client'

import Loader from "@/app/Components/Loader";
import { useGetGameId } from "@/app/hooks/query-hooks/useGetGameId";
import { useGetGameMoves } from "@/app/hooks/query-hooks/useGetGameMoves";
import { Chess } from "chess.js";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { PlayerBar } from "@/app/Components/PlayerBar";
import GameSkeleton from "@/app/Components/GameSkeleton";
import { GAME_TYPE } from "@/app/types/enum";
import { UserAttributes } from "@/app/types/user";

// Page to handle viewing the previous game (game history)
const Home = () => {
    // Get the game id from the route params
    const { id }: { id: string } = useParams();
    // GEt the game information by using its id
    const { data: game, isLoading: isGameReady } = useGetGameId(id);
    // Get the game moves by using its id
    const { data: gameMoves, isLoading: isgameMoveLoading } = useGetGameMoves(id);
    // State to manage on/off autoplay mode
    const [autoPlay, setAutoPlay] = useState(false)
    // State to store the current move
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    // State to manage the current board side
    const [boardSide, setBoardSide] = useState<'white' | 'black'>('white')
    // Manage the chessboard current state
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current
    // Manage the UI of the chessboard
    const [chessState, setChessState] = useState(chessGame.fen());
    // Manage the interval of the autoplay
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // Function to get the correct elo
    const handleGetCorrectElo = (gameType: GAME_TYPE, player: UserAttributes) => {
        switch (gameType) {
            case GAME_TYPE.ROCKET: return player.rocketElo
            case GAME_TYPE.BLITZ: return player.blitzElo
            case GAME_TYPE.RAPID: return player.elo
            default: return 0
        }
    }
    useEffect(() => {
        // UseEffect to manage the autoplay mode
        // Get the current moveindex
        let currentIndex = currentMoveIndex;
        if (autoPlay == true) {
            // If the autoplay == true, the gameMoves is defined and the currentIndex < the gameMove length
            if (gameMoves != undefined && currentIndex < gameMoves.length) {
                // Create an interval to move the board every 500 ms
                autoPlayRef.current = setInterval(() => {
                    try {
                        // Make a next move with the current move index
                        chessGame.move(gameMoves[currentIndex].san);
                        // Increase the index by 1 to go to next move
                        currentIndex = currentIndex + 1;
                        // Update the UI and the "outside state" currentMove because state cannot be used in interval
                        setCurrentMoveIndex(currentIndex);
                        // Update the chessboard fen UI
                        setChessState(chessGame.fen());
                        // Check if the currentIndex >= gameMoves.length -> stop the autoplay
                        if (currentIndex >= gameMoves.length) {
                            setAutoPlay(false);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }, 500)
            } else {
                // If the gameMove is undefined and currentIndex < gameMoves.length
                setAutoPlay(false);
            }

        } else {
            // If the autoplay == false -> remove the interval
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
        }
        // Remove the interval if the component unmounted
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
        }
    }, [autoPlay])
    if (isGameReady || isgameMoveLoading || !game || !gameMoves) return <GameSkeleton />

    // Function to control the move of the chessboard by pressing key down
    const handleArrowKeyDown = (keyDown: string) => {
        if (keyDown == "ArrowLeft") {
            // If it is ArrowLeft -> Undo the move
            handleUndoMove();
        } else if (keyDown == "ArrowRight") {
            // If it is arrow right -> make a next move
            if (currentMoveIndex < gameMoves.length) {
                handleMoveForward();
            }
        }
    }
    const handleGoToFirstMove = () => {
        // Function to go back to first move
        // Reset the game, fen, currentMoveIndex
        chessGame.reset();
        setChessState(chessGame.fen());
        setCurrentMoveIndex(0);
    }

    const handleGoToSpecificMove = (moveIndex: number) => {
        // Function to handle go to a specific move
        if (moveIndex > currentMoveIndex - 1) {
            // If the moveIndex > currentMoveIndex - 1 -> Loops from the currentMoveIndex to the
            // Specified moveIndex, make a move and then update the CurrentMoveIndex to be the specified moveIndex + 1
            // Note that: if the user make a move 0, the UI will show the move 0 but the currentMoveIndex must be 0(moveIndex) + 1 = 1
            for (let i = currentMoveIndex; i <= moveIndex; i++) {
                chessGame.move(gameMoves[i].san);
            }
            setChessState(chessGame.fen());
            setCurrentMoveIndex(moveIndex + 1);
        }
        if (moveIndex < currentMoveIndex - 1) {
            // Remember that the currentMoveIndex always start sooner than the UI + 1 move
            // If the specified moveIndex < currentMoveIndex - 1 -> we have to undo the move to go back
            // Loops from the currentMoveIndex - 1 to when i < moveIndex then stop (Why? because the chessGame.undo() only care about number of time we undo)
            // It is independent from the currentMoveIndex
            for (let i = currentMoveIndex - 1; i > moveIndex; i--) {
                chessGame.undo();
            }
            // Update the UI
            setChessState(chessGame.fen());
            setCurrentMoveIndex(moveIndex + 1);
        }
    }

    // Function to handle moving forward
    const handleMoveForward = () => {
        // If the currentMoveIndex < gameMoves -> can continue to move
        if (currentMoveIndex < gameMoves.length) {
            handleMove();
        } else {
            setAutoPlay(false);
        }
    }
    // Function to undo a move
    const handleUndoMove = () => {
        // Undo the move
        chessGame.undo();
        // Update the UI
        setChessState(chessGame.fen());
        // Update the CurrentMoveIndex
        setCurrentMoveIndex(Math.max(currentMoveIndex - 1, 0));
    }

    // Function to handling move
    const handleMove = () => {
        try {
            // Try to make a move at the currentMoveIndex
            chessGame.move(gameMoves[currentMoveIndex].san)
            // Update the currentMoveIndex
            setCurrentMoveIndex(currentMoveIndex + 1);
            // Update the chessboard UI
            setChessState(chessGame.fen());
        } catch (error) {
            console.log(error);
        }
    };

    // Function to handle update the boardside
    const handleChangeBoardSide = () => {
        if (boardSide == 'white') {
            setBoardSide('black');
        } else {
            setBoardSide('white')
        }
    }

    const formatSecondsToMMSS = (seconds: number) => {
        ///Format the Time left to the mm:ss for displaying
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    }
    return (
        <div className="w-full min-h-screen flex lg:flex-row flex-col items-center justify-center bg-[#1a1917]" tabIndex={0} onKeyDown={(e) => handleArrowKeyDown(e.key)}>
            <div className='lg:h-[850px] md:h-[650px] flex flex-col items-center justify-between'>
                {boardSide == 'white' ? <><PlayerBar
                    name={game.player2.name}
                    elo={handleGetCorrectElo(game.gameType, game.player2)}
                    isMyTurn={game.player2.id == gameMoves[currentMoveIndex - 1]?.moverId}
                    time={game.player2.id == gameMoves[currentMoveIndex - 1]?.moverId ?
                        formatSecondsToMMSS(gameMoves[currentMoveIndex - 1]?.playerTimeLeft ?? 0) ?? '00:00'
                        :
                        formatSecondsToMMSS(gameMoves[currentMoveIndex - 2]?.playerTimeLeft ?? 0) ?? '00:00'} />
                    <div className='xl:w-[710px] xl:h-[710px] lg:w-[600px] lg:h-[600px] md:w-[500px] md:h-[500px]'>
                        <Chessboard options={{ boardStyle: { width: '100%', height: '100%' }, position: chessState, boardOrientation: boardSide }} />
                    </div>

                    <PlayerBar
                        name={game.player1.name}
                        elo={handleGetCorrectElo(game.gameType, game.player1)}
                        isMyTurn={game.player1.id == gameMoves[currentMoveIndex - 1]?.moverId}
                        time={game.player1.id == gameMoves[currentMoveIndex - 1]?.moverId ?
                            formatSecondsToMMSS(gameMoves[currentMoveIndex - 1]?.playerTimeLeft ?? 0) ?? '00:00'
                            :
                            formatSecondsToMMSS(gameMoves[currentMoveIndex - 2]?.playerTimeLeft ?? 0) ?? '00:00'}
                    />
                </> :
                    <>
                        <PlayerBar
                            name={game.player1.name}
                            elo={handleGetCorrectElo(game.gameType, game.player1)}
                            isMyTurn={game.player1.id == gameMoves[currentMoveIndex - 1]?.moverId}
                            time={game.player1.id == gameMoves[currentMoveIndex - 1]?.moverId ?
                                formatSecondsToMMSS(gameMoves[currentMoveIndex - 1]?.playerTimeLeft ?? 0) ?? '00:00'
                                :
                                formatSecondsToMMSS(gameMoves[currentMoveIndex - 2]?.playerTimeLeft ?? 0) ?? '00:00'} />
                        <div className='xl:w-[710px] xl:h-[710px] lg:w-[600px] lg:h-[600px] md:w-[500px] md:h-[500px]'>
                            <Chessboard options={{ boardStyle: { width: '100%', height: '100%' }, position: chessState, boardOrientation: boardSide }} />
                        </div>
                        <PlayerBar
                            name={game.player2.name}
                            elo={handleGetCorrectElo(game.gameType, game.player2)}
                            isMyTurn={game.player2.id == gameMoves[currentMoveIndex - 1]?.moverId}
                            time={game.player2.id == gameMoves[currentMoveIndex - 1]?.moverId ? formatSecondsToMMSS(gameMoves[currentMoveIndex - 2]?.playerTimeLeft ?? 0) ?? '00:00' : formatSecondsToMMSS(gameMoves[currentMoveIndex - 1]?.playerTimeLeft ?? 0) ?? '00:00'} />

                    </>
                }
            </div>
            <div className="lg:w-1/3 w-full flex flex-col rounded-2xl shadow-xl bg-[#1f1e1b] border border-[#2c2b29] overflow-hidden text-white">


                <div className="flex text-sm font-semibold uppercase tracking-wider border-b border-[#3a3937]">
                    <div className="w-1/2 text-center p-4 bg-[#302e2b] border-r border-[#3a3937] cursor-pointer hover:bg-[#3a3835] transition">
                        Các nước đi
                    </div>
                    <div className="w-1/2 text-center p-4 bg-[#1f1e1b] cursor-pointer hover:bg-[#2a2926] transition">
                        Thông tin
                    </div>
                </div>


                <div className="h-[500px] overflow-y-auto bg-black/20 p-2 rounded-b-lg ">
                    <div className="flex flex-wrap">
                        {gameMoves.map((move, index) => (
                            <div
                                key={`move-${move.id}`}
                                className={`w-1/2 flex items-center justify-center gap-2 py-2 font-medium ${Math.floor(index / 2) % 2 === 0 ? "bg-[#2a2926]/80" : ""
                                    }`}
                                onClick={() => handleGoToSpecificMove(index)}
                            >
                                <span className="opacity-50">{index + 1}.</span>
                                <span className={currentMoveIndex - 1 == index ? 'bg-gray-600' : ''}>{move.lan}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full px-5 mt-2">
                    <button className="w-full py-2 uppercase font-semibold flex gap-2 justify-center bg-[#302e2b] hover:bg-[#454441] rounded-2xl" onClick={() => handleChangeBoardSide()}>
                        <AutorenewIcon />
                        <div>Change the board</div>
                    </button>
                </div>
                <div className="w-full flex justify-center p-5 gap-3 mt-2">
                    <div className="w-1/6 py-2 font-semibold uppercase bg-[#302e2b] hover:bg-[#454441] flex justify-center items-center rounded-2xl shadow-2xl" onClick={() => handleGoToFirstMove()}>S</div>
                    <div className="w-1/6 py-2 font-semibold uppercase bg-[#302e2b] hover:bg-[#454441] flex justify-center items-center rounded-2xl shadow-2xl" onClick={() => handleUndoMove()}><ArrowBackIosIcon /></div>
                    <div
                        className={`w-2/6 py-2 font-semibold uppercase bg-[#302e2b] hover:bg-[#454441] flex justify-center items-center rounded-2xl shadow-2xl ${autoPlay ? 'bg-[#454441] hover:bg-[#302e2b]' : 'bg-[#302e2b] hover:bg-[#454441]'}`}
                        onClick={() => setAutoPlay(!autoPlay)}>
                        {autoPlay ? <PauseIcon /> : <PlayArrowIcon />}

                    </div>
                    <div className="w-1/6 py-2 font-semibold uppercase bg-[#302e2b] hover:bg-[#454441] flex justify-center items-center rounded-2xl shadow-2xl" onClick={() => handleMoveForward()}><ArrowForwardIosIcon /></div>
                    <div className="w-1/6 py-2 font-semibold uppercase bg-[#302e2b] hover:bg-[#454441] flex justify-center items-center rounded-2xl shadow-2xl" onClick={() => handleGoToSpecificMove(gameMoves.length - 1)}>E</div>
                </div>

            </div>
        </div>

    )
}

export default Home;