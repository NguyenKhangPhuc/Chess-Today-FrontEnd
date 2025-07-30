'use client'
import { getSocket } from "@/app/libs/sockets"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Chess, Square } from "chess.js"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Chessboard, fenStringToPositionObject, PieceDropHandlerArgs, PieceHandlerArgs, SquareHandlerArgs } from "react-chessboard"
import { getGame, getMe } from "../services"

const ChessPvP = () => {
    const socket = getSocket()
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen())
    const [currentPiece, setCurrentPiece] = useState('')
    const [squareOptions, setSquareOptions] = useState({})
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([])
    const [showAnimations, setShowAnimations] = useState(true)
    const premovesRef = useRef<PieceDropHandlerArgs[]>([])
    const { id }: { id: string } = useParams()

    const { data } = useQuery({
        queryKey: ['chess-game', id],
        queryFn: () => getGame(id),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const { data: userData } = useQuery({
        queryKey: ['current_user'],
        queryFn: getMe
    })

    console.log(data)
    console.log(userData)

    const me = {
        color: userData?.id === data?.player1Id ? 'w' : 'b',
        opponent: userData?.id === data?.player1Id ? data?.player2Id : data?.player1Id
    }

    useEffect(() => {
        if (data?.fen) {
            setChessState(data.fen)
            chessGame.load(data.fen)
        }
        const handleFenUpdate = (fen: string) => {
            console.log('received FEN:', fen);
            setChessState(fen);
            chessGame.load(fen)
            handlePremove()
        };

        socket.on('board_state_change', handleFenUpdate);

        return () => {
            socket.off('board_state_change', handleFenUpdate);
        };
    }, [data?.fen]);


    const handlePremove = () => {
        if (premovesRef.current.length > 0) {
            const nextPlayerPremove = premovesRef.current[0]
            premovesRef.current.splice(0, 1)
            setTimeout(() => {
                const successfulMove = onPieceDrop(nextPlayerPremove)
                if (!successfulMove) {
                    premovesRef.current = [];
                }

                setPremoves([...premovesRef.current])
                setShowAnimations(false)
                setTimeout(() => {
                    setShowAnimations(true)
                }, 50)
            }, 300)
        }
    }

    const onPieceDrop = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        if (!targetSquare || sourceSquare === targetSquare) {
            return false
        }

        const pieceColor = me.color;
        if (chessGame.turn() !== pieceColor) {
            premovesRef.current.push({
                sourceSquare,
                targetSquare,
                piece
            })
            setPremoves([...premovesRef.current])
            return true;
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
                opponentId: me.opponent,
                roomId: id,
                fen: chessGame.fen(),
            })
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
        console.log(piece?.pieceType[0])
        if (piece?.pieceType[0] && piece?.pieceType[0] !== me.color) {
            return
        }
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
                opponentId: me.opponent,
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

    function onSquareRightClick() {
        premovesRef.current = [];
        setPremoves([...premovesRef.current]);

        // disable animations while clearing premoves
        setShowAnimations(false);

        // re-enable animations after a short delay
        setTimeout(() => {
            setShowAnimations(true);
        }, 50);
    }

    const position = fenStringToPositionObject(chessState, 8, 8);
    const squareStyles: Record<string, React.CSSProperties> = {};

    // add premoves to the position object to show them on the board
    for (const premove of premoves) {
        delete position[premove.sourceSquare];
        position[premove.targetSquare!] = {
            pieceType: premove.piece.pieceType
        };
        squareStyles[premove.sourceSquare] = {
            backgroundColor: 'rgba(255,0,0,0.2)'
        };
        squareStyles[premove.targetSquare!] = {
            backgroundColor: 'rgba(255,0,0,0.2)'
        };
    }

    return <Chessboard options={{

        canDragPiece,
        position: position,
        onPieceDrop: onPieceDrop,
        onSquareClick: onSquareClick,
        onSquareRightClick,
        showAnimations,
        squareStyles: { ...squareOptions, ...squareStyles },
        id: 'play-vs-random',
        boardStyle: { width: '700px' },
        boardOrientation: me.color === 'w' ? 'white' : 'black',
    }} />
}

export default ChessPvP