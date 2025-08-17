'use client';
import axios from 'axios';
import { Chess, Square } from 'chess.js';
import React, { useEffect, useRef, useState } from "react";
import { Chessboard, fenStringToPositionObject, PieceHandlerArgs } from "react-chessboard";
import { PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';
import { botMakeMove, createNewGameMoves, getFeedBack, getGame, getMe, updateGameFen } from '../services';
import { GameAttributes, MoveAttributes, ProfileAttributes } from '../types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getSocket } from '../libs/sockets';

interface response {
    moveInfo: moveInfo,
    explanation: string,
}

export interface EngineScore {
    type: string,
    value: number
}

interface moveInfo {
    bestMove: string,
    score: EngineScore | null
}

const ChessboardCopmonent = ({ message, setMessage }: { message: Array<string>, setMessage: React.Dispatch<React.SetStateAction<Array<string>>> }) => {
    const socket = getSocket()
    const queryClient = useQueryClient()
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen())
    const [currentPiece, setCurrentPiece] = useState('')
    const [squareOptions, setSquareOptions] = useState({})
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([]);
    const [showAnimations, setShowAnimations] = useState(true);
    const premovesRef = useRef<PieceDropHandlerArgs[]>([]);
    const { id }: { id: string } = useParams()
    const { data, isLoading } = useQuery<GameAttributes>({
        queryKey: [`game ${id}`],
        queryFn: () => getGame(id),
    })
    const { data: userData } = useQuery<ProfileAttributes>({
        queryKey: ['current_user'],
        queryFn: getMe
    })
    const updateGameFenMutation = useMutation({
        mutationKey: [`update_game_${id}`],
        mutationFn: updateGameFen,
        onSuccess: (data) => {

        }
    })
    const createNewMoveMutation = useMutation({
        mutationKey: ['create_new_move'],
        mutationFn: createNewGameMoves,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [`moves_game_${id}`] })


        }
    })
    const getExplanationMutation = useMutation({
        mutationKey: ['get_explanation'],
        mutationFn: getFeedBack,
        onSuccess: (res) => {
            console.log('Explanation:', res)
        }
    })
    console.log(data)
    const botMakeMoveMutation = useMutation({
        mutationKey: ['bot_make_move'],
        mutationFn: botMakeMove,
        onSuccess: (res: response) => {
            console.log('This is bot move', res)
            getExplanationMutation.mutate({ move: res.moveInfo.bestMove, beforeFen: chessState, score: res.moveInfo.score })
            handleBotMove(res)

        }
    })
    useEffect(() => {
        if (data?.fen) {
            setChessState(data?.fen)
            chessGame.load(data?.fen)
        }
    }, [data])
    if (!userData || !data) return
    const botId = userData?.id === data?.player1Id ? data?.player2Id : data?.player1Id
    console.log(botId)
    const handleBotMove = (res: response) => {
        const bestMove = res.moveInfo.bestMove
        const sourceSquare = bestMove.substring(0, 2)
        const targetSquare = bestMove.substring(2, 4)
        try {
            chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'queen'
            })
            updateGameFenMutation.mutate({ gameId: id, fen: chessGame.fen() });
            setChessState(chessGame.fen())
            setSquareOptions({})
            setCurrentPiece('')
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[chessGame.history({ verbose: true }).length >= 1 ? chessGame.history({ verbose: true }).length - 1 : 0], gameId: id, moverId: botId }
            createNewMoveMutation.mutate(newMove)
            if (premovesRef.current.length > 0) {
                const nextPlayerPremove = premovesRef.current[0];
                premovesRef.current.splice(0, 1);

                // wait for CPU move animation to complete
                setTimeout(() => {
                    // execute the premove
                    const premoveSuccessful = onPieceDrop(nextPlayerPremove);

                    // if the premove was not successful, clear all premoves
                    if (!premoveSuccessful) {
                        premovesRef.current = [];
                    }

                    // update the premoves state
                    setPremoves([...premovesRef.current]);

                    // disable animations while clearing premoves
                    setShowAnimations(false);

                    // re-enable animations after a short delay
                    setTimeout(() => {
                        setShowAnimations(true);
                    }, 50);
                }, 300);
            }
        } catch {
            console.log('Error when AI move')
        }
    }
    const makeRandomMove = () => {
        if (chessGame.isGameOver()) {
            return null
        }
        botMakeMoveMutation.mutate(chessGame.fen())
    }

    const onPieceDrop = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        if (!targetSquare || sourceSquare === targetSquare) {
            return false;
        }
        if (!targetSquare) {
            return false
        }
        const pieceColor = piece.pieceType[0]; // 'w' or 'b'
        if (chessGame.turn() !== pieceColor) {
            premovesRef.current.push({
                sourceSquare,
                targetSquare,
                piece
            });
            setPremoves([...premovesRef.current]);
            // return early to stop processing the move and return true to not animate the move
            return true;
        }
        try {
            chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            })
            updateGameFenMutation.mutate({ gameId: id, fen: chessGame.fen() });
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions({})
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[chessGame.history({ verbose: true }).length >= 1 ? chessGame.history({ verbose: true }).length - 1 : 0], gameId: id, moverId: userData.id }
            createNewMoveMutation.mutate(newMove)
            getExplanationMutation.mutate({ move: newMove.lan, beforeFen: newMove.before, score: null });
            makeRandomMove()
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
            setTimeout(makeRandomMove, 500)
            return true
        } catch {
            return false
        }
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

    // only allow white pieces to be dragged
    function canDragPiece({
        piece
    }: PieceHandlerArgs) {
        return piece.pieceType[0] === 'w';
    }

    // create a position object from the fen string to split the premoves from the game state
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
        onSquareRightClick,
        canDragPiece,
        position: position,
        onPieceDrop,
        onSquareClick,
        squareStyles: { ...squareOptions, ...squareStyles },
        showAnimations,
        id: 'play-vs-random',
        boardStyle: { width: '90%' }
    }} />
}

export default ChessboardCopmonent