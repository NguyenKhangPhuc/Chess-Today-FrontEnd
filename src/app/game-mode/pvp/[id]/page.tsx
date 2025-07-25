'use client'
import socket from "@/app/sockets"
import axios from "axios"
import { Chess, Square } from "chess.js"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Chessboard, PieceDropHandlerArgs, PieceHandlerArgs, SquareHandlerArgs } from "react-chessboard"

interface player {
    id: string,
    color: 'w' | 'b'
}

interface roomId {
    player1: player
    player2: player
}


const Home = () => {
    const { id }: { id: string } = useParams()

    const roomId: roomId = {
        player1: { id: id.split('-')[0], color: 'w' },
        player2: { id: id.split('-')[1], color: 'b' }
    }

    const me = socket.id === roomId.player1.id ? roomId.player1 : roomId.player2
    console.log(roomId)
    useEffect(() => {
        const handleFenUpdate = (fen: string) => {
            console.log('received FEN:', fen);
            setChessState(fen);
            chessGame.load(fen)
        };

        socket.on('board_state_change', handleFenUpdate);

        return () => {
            socket.off('board_state_change', handleFenUpdate);
        };
    }, []);
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen())
    const [currentPiece, setCurrentPiece] = useState('')
    const [squareOptions, setSquareOptions] = useState({})

    console.log(chessGame.moves())

    const onPieceDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
        if (!targetSquare) {
            return false
        }
        try {
            chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            })
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions({})
            socket.emit('board_state_change', {
                roomId: id,
                fen: chessGame.fen(),
            });

            return true
        } catch {
            return false
        }

    }

    const getMoveOptions = (square: Square) => {
        const validMoves = chessGame.moves({
            square: square,
            verbose: true
        })
        if (validMoves.length === 0) {
            return false
        }
        const newSquare: Record<string, React.CSSProperties> = {}
        for (const move of validMoves) {
            console.log(move)
            newSquare[move.to] = {
                background: chessGame.get(move.to) && chessGame.get(move.to)?.color !== chessGame.get(square)?.color ?
                    'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%',
            }
        }
        newSquare[square] = { background: 'rgba(255, 255, 0, 0.4)', }
        setSquareOptions(newSquare)
        return true

    }

    const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
        if (!currentPiece && !piece) {
            return false
        }
        if (!currentPiece && piece) {
            const hasMoveOptions = getMoveOptions(square as Square)
            setCurrentPiece(hasMoveOptions ? square : '')
            return
        }

        const validMoves = chessGame.moves({
            square: currentPiece as Square,
            verbose: true,
        })

        const foundMove = validMoves.find(m => m.to === square)
        if (!foundMove) {
            const hasMoveOptions = getMoveOptions(square as Square)
            setCurrentPiece(hasMoveOptions ? square : '')
            return
        }
        try {
            chessGame.move({
                from: currentPiece,
                to: square,
                promotion: 'q'
            })
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions('')
            socket.emit('board_state_change', {
                roomId: id,
                fen: chessGame.fen(),
            });
            return true
        } catch {
            return false
        }
    }

    const canDragPiece = ({ piece }: PieceHandlerArgs) => {
        return piece.pieceType[0] === me.color
    }


    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return <Chessboard options={{
        canDragPiece,
        position: chessState,
        onPieceDrop: onPieceDrop,
        onSquareClick: onSquareClick,
        squareStyles: squareOptions,
        id: 'play-vs-random',
        boardStyle: { width: '700px' },
        boardOrientation: me.color === 'w' ? 'white' : 'black' as const
    }} />
}

export default Home