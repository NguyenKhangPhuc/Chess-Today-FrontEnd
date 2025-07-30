'use client';
import axios from 'axios';
import { Chess, Square } from 'chess.js';
import React, { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';

interface response {
    moveInfo: moveInfo,
    explanation: string,
}

interface moveInfo {
    bestMove: string,
    pv: Array<string>,
    score: number | string,
}

const XiangqiBoard = ({ message, setMessage }: { message: Array<string>, setMessage: React.Dispatch<React.SetStateAction<Array<string>>> }) => {
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen())
    const [currentPiece, setCurrentPiece] = useState('')
    const [squareOptions, setSquareOptions] = useState({})


    const makeRandomMove = () => {
        if (chessGame.isGameOver()) {
            return null
        }
        axios.post<response>('http://localhost:3001/api/analyze', { fen: chessGame.fen() })
            .then((res) => {

                const bestMove = res.data.moveInfo.bestMove
                const sourceSquare = bestMove.substring(0, 2)
                const targetSquare = bestMove.substring(2, 4)
                try {
                    chessGame.move({
                        from: sourceSquare,
                        to: targetSquare,
                        promotion: 'queen'
                    })
                    setChessState(chessGame.fen())
                    setSquareOptions({})
                    setCurrentPiece('')
                    setMessage(message.concat(res.data.explanation))
                    return true
                } catch {
                    return false
                }
            })
            .catch(err => console.log(err))
    }

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
            setTimeout(makeRandomMove, 500)
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
            makeRandomMove()
            return true
        } catch {
            return false
        }
    }


    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return <Chessboard options={{
        position: chessState,
        onPieceDrop: onPieceDrop,
        onSquareClick: onSquareClick,
        squareStyles: squareOptions,
        id: 'play-vs-random',
        boardStyle: { width: '90%' }
    }} />
}

export default XiangqiBoard