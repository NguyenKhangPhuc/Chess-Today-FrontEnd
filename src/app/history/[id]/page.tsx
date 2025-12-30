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
const Home = () => {
    const { id }: { id: string } = useParams();
    const { data: game, isLoading: isGameReady } = useGetGameId(id);
    const { data: gameMoves, isLoading: isgameMoveLoading } = useGetGameMoves(id);
    const [autoPlay, setAutoPlay] = useState(false)
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [boardSide, setBoardSide] = useState<'white' | 'black'>('white')
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen());
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
    // console.log(chessGame.history({ verbose: true }));
    // console.log(currentMoveIndex, gameMoves?.length)
    console.log(chessState)
    const handleGetCorrectElo = (gameType: GAME_TYPE, player: UserAttributes) => {
        switch (gameType) {
            case GAME_TYPE.ROCKET: return player.rocketElo
            case GAME_TYPE.BLITZ: return player.blitzElo
            case GAME_TYPE.RAPID: return player.elo
            default: return 0
        }
    }
    useEffect(() => {
        let currentIndex = currentMoveIndex;
        if (autoPlay == true) {
            if (gameMoves != undefined && currentIndex < gameMoves.length) {
                autoPlayRef.current = setInterval(() => {
                    try {
                        chessGame.move(gameMoves[currentIndex].san);
                        currentIndex = currentIndex + 1;
                        setCurrentMoveIndex(currentIndex);
                        setChessState(chessGame.fen());
                        if (currentIndex >= gameMoves.length) {
                            setAutoPlay(false);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    console.log(currentIndex, gameMoves?.length)
                }, 500)
            } else {
                setAutoPlay(false);
            }

        } else {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
        }
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
        }
    }, [autoPlay])
    if (isGameReady || isgameMoveLoading || !game || !gameMoves) return <GameSkeleton />
    const handleArrowKeyDown = (keyDown: string) => {
        if (keyDown == "ArrowLeft") {
            handleUndoMove();
        } else if (keyDown == "ArrowRight") {
            if (currentMoveIndex < gameMoves.length) {
                handleMoveForward();
            }
        }
    }
    const handleGoToFirstMove = () => {
        chessGame.reset();
        setChessState(chessGame.fen());
        setCurrentMoveIndex(0);
    }

    const handleGoToSpecificMove = (moveIndex: number) => {
        if (moveIndex > currentMoveIndex - 1) {
            for (let i = currentMoveIndex; i <= moveIndex; i++) {
                chessGame.move(gameMoves[i].san);
            }
            setChessState(chessGame.fen());
            setCurrentMoveIndex(moveIndex + 1);
        }
        if (moveIndex < currentMoveIndex - 1) {
            for (let i = currentMoveIndex - 1; i > moveIndex; i--) {
                chessGame.undo();
            }
            setChessState(chessGame.fen());
            setCurrentMoveIndex(moveIndex + 1);
        }
    }

    const handleMoveForward = () => {
        if (currentMoveIndex < gameMoves.length) {
            handleMove();
        } else {
            setAutoPlay(false);
        }
    }

    const handleUndoMove = () => {
        chessGame.undo();
        setChessState(chessGame.fen());
        setCurrentMoveIndex(Math.max(currentMoveIndex - 1, 0));
    }


    const handleMove = () => {
        try {
            chessGame.move(gameMoves[currentMoveIndex].san)
            setCurrentMoveIndex(currentMoveIndex + 1);
            setChessState(chessGame.fen());
        } catch (error) {
            console.log(error);
        }
    };

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
    console.log(gameMoves, currentMoveIndex, game.player2.id == gameMoves[currentMoveIndex - 1]?.moverId)
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