'use client'

import Loader from "@/app/Components/Loader";
import { useGetGameId } from "@/app/hooks/query-hooks/useGetGameId";
import { useGetGameMoves } from "@/app/hooks/query-hooks/useGetGameMoves";
import { Chess } from "chess.js";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { Chessboard } from "react-chessboard";

const Home = () => {
    const { id }: { id: string } = useParams();
    const { data: game, isLoading: isGameReady } = useGetGameId(id);
    const { data: gameMoves, isLoading: isgameMoveLoading } = useGetGameMoves(id);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen());

    console.log(chessGame.history({ verbose: true }));
    console.log(currentMoveIndex, gameMoves?.length)
    if (isGameReady || isgameMoveLoading || !game || !gameMoves) return (
        <div className="w-full h-screen bg-black flex justify-center items-center"><Loader /></div>
    )
    const handleArrowKeyDown = (keyDown: string) => {
        if (keyDown == "ArrowLeft") {
            chessGame.undo();
            setChessState(chessGame.fen());
            setCurrentMoveIndex(Math.max(currentMoveIndex - 1, 0));
        } else if (keyDown == "ArrowRight") {
            if (currentMoveIndex < gameMoves.length) {
                setCurrentMoveIndex(currentMoveIndex + 1);
                handleMove();
            }
        }
    }

    const handleMove = () => {
        try {
            chessGame.move({
                from: gameMoves[currentMoveIndex].from,
                to: gameMoves[currentMoveIndex].to,
                promotion: gameMoves[currentMoveIndex].promotion,
            })
            setChessState(chessGame.fen());
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#1a1917]" tabIndex={0} onKeyDown={(e) => handleArrowKeyDown(e.key)}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                minHeight: '850px',
                justifyContent: 'space-between'
            }} >
                <Chessboard options={{ boardStyle: { width: '720px', height: '720px' }, position: chessState }} />
            </div>
        </div>
    )
}

export default Home;