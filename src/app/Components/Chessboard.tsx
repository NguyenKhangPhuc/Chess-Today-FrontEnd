'use client';
import axios from 'axios';
import { Chess, PieceSymbol, Square } from 'chess.js';
import React, { useEffect, useRef, useState } from "react";
import { Chessboard, chessColumnToColumnIndex, defaultPieces, DraggingPieceDataType, fenStringToPositionObject, PieceHandlerArgs, PieceRenderObject } from "react-chessboard";
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

const ChessboardCopmonent = () => {
    const queryClient = useQueryClient()
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen())
    const [currentPiece, setCurrentPiece] = useState('')
    const [squareOptions, setSquareOptions] = useState({})
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([]);
    const [showAnimations, setShowAnimations] = useState(true);
    const premovesRef = useRef<PieceDropHandlerArgs[]>([]);
    const [promotionMove, setPromotionMove] = useState<Omit<PieceDropHandlerArgs, 'piece'> | null>(null);
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
            getExplanationMutation.mutate({ move: res.moveInfo.bestMove, beforeFen: chessState, score: res.moveInfo.score, senderId: botId, gameId: id })
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

    const promotionCheck = ({ targetSquare, piece }: PieceDropHandlerArgs) => {
        ///Check for promotion, if there are no targetSquare, return false
        if (!targetSquare) return false
        ///If the chosen piece is not a Pawn, return false
        if (!piece || piece.pieceType[1] !== 'P') return false;
        ///Dependings on the color to check if the pawn need to go to row 8 or row 1 on the board.
        return targetSquare.match(/\d+$/)?.[0] === '8';
    }

    const positionToFen = () => {
        const chess = new Chess();
        chess.clear();

        for (const square in position) {
            const { pieceType } = position[square];
            const color = pieceType[0].toLowerCase() as 'w' | 'b';
            const type = pieceType[1].toLowerCase() as PieceSymbol; // 'q', 'n', 'b', 'r', 'p', 'k'

            chess.put({ type, color }, square as Square);
        }

        return chess.fen();
    }

    const getValidMovesRegardlessOfTurn = (game: Chess, square: string) => {
        const clone = new Chess(game.fen()); // clone current part

        if (clone.turn() !== 'w') {
            const fenParts = clone.fen().split(' ');
            fenParts[1] = 'w'; // Change turn in fen
            clone.load(fenParts.join(' '));
        }

        return clone.moves({ square: square as Square, verbose: true });
    }

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
            if (promotionCheck({ sourceSquare, targetSquare, piece })) {
                // get all possible moves for the source square
                const tempChessGame = new Chess(positionToFen())
                ///Get valid moves regardless of turn, to get the valid move for the premove.
                const possibleMoves = getValidMovesRegardlessOfTurn(tempChessGame, sourceSquare)

                // check if target square is in possible moves (accounting for promotion notation)
                console.log(possibleMoves)
                console.log(targetSquare)
                if (possibleMoves.some(move => move.to === targetSquare)) {
                    setPromotionMove({
                        sourceSquare,
                        targetSquare
                    });
                }

                // return true so that the promotion move is not animated
                // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
                return true;
            }
            console.log(piece)
            premovesRef.current.push({
                sourceSquare,
                targetSquare,
                piece
            });
            setPremoves([...premovesRef.current]);
            // return early to stop processing the move and return true to not animate the move
            return true;
        }
        if (promotionCheck({ sourceSquare, targetSquare, piece })) {
            const possibleMoves = chessGame.moves({
                square: sourceSquare as Square,
                verbose: true
            });
            // get all possible moves for the source square
            // check if target square is in possible moves (accounting for promotion notation)
            console.log(possibleMoves)
            console.log(targetSquare)
            if (possibleMoves.some(move => move.to === targetSquare)) {
                setPromotionMove({
                    sourceSquare,
                    targetSquare
                });
            }

            // return true so that the promotion move is not animated
            // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
            return true;
        }
        try {
            console.log({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece.pieceType[1].toLowerCase()
            })
            chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece.pieceType[1].toLowerCase()
            })
            updateGameFenMutation.mutate({ gameId: id, fen: chessGame.fen() });
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions({})
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[chessGame.history({ verbose: true }).length >= 1 ? chessGame.history({ verbose: true }).length - 1 : 0], gameId: id, moverId: userData.id }
            createNewMoveMutation.mutate(newMove)
            getExplanationMutation.mutate({ move: newMove.lan, beforeFen: newMove.before, score: null, senderId: userData.id, gameId: data.id });
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
        console.log({ square, piece })
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
        const chosenPiece = chessGame.get(currentPiece as Square)!
        console.log(chosenPiece)
        const chosenPieceToDraggingPieceDataType = {
            isSparePiece: false,
            pieceType: chosenPiece?.color + chosenPiece?.type.toUpperCase(),
            position: currentPiece,
        } as DraggingPieceDataType
        if (promotionCheck({ sourceSquare: currentPiece, targetSquare: square, piece: chosenPieceToDraggingPieceDataType })) {
            const possibleMoves = chessGame.moves(
                {
                    square: currentPiece as Square,
                    verbose: true
                }
            )
            if (possibleMoves.map((move) => move.to === square)) {
                setPromotionMove({ sourceSquare: currentPiece, targetSquare: square });
            }
            return;
        }
        try {
            chessGame.move({
                from: currentPiece,
                to: square,
                promotion: 'q'
            })
            updateGameFenMutation.mutate({ gameId: id, fen: chessGame.fen() });
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions({})
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[chessGame.history({ verbose: true }).length >= 1 ? chessGame.history({ verbose: true }).length - 1 : 0], gameId: id, moverId: userData.id }
            createNewMoveMutation.mutate(newMove)
            getExplanationMutation.mutate({ move: newMove.lan, beforeFen: newMove.before, score: null, senderId: userData.id, gameId: data.id });
            makeRandomMove()
            return true
        } catch {
            return false
        }
    }
    function onPromotionPieceSelect(piece: PieceSymbol) {
        if (chessGame.turn() !== 'w' && promotionMove) {
            console.log(promotionMove)
            const pieceAsDraggingPiece = {
                isSparePiece: false,
                position: promotionMove.sourceSquare,
                pieceType: 'w' + piece.toUpperCase(),
            }
            console.log({ sourceSquare: promotionMove.sourceSquare, targetSquare: promotionMove.targetSquare, piece: pieceAsDraggingPiece })
            premovesRef.current.push({ sourceSquare: promotionMove.sourceSquare, targetSquare: promotionMove.targetSquare, piece: pieceAsDraggingPiece });
            setPremoves([...premovesRef.current]);
            setPromotionMove(null);
            return;
        }
        try {
            chessGame.move({
                from: promotionMove!.sourceSquare,
                to: promotionMove!.targetSquare as Square,
                promotion: piece
            });
            updateGameFenMutation.mutate({ gameId: id, fen: chessGame.fen() });
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions({})
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[chessGame.history({ verbose: true }).length >= 1 ? chessGame.history({ verbose: true }).length - 1 : 0], gameId: id, moverId: userData.id }
            createNewMoveMutation.mutate(newMove)
            getExplanationMutation.mutate({ move: newMove.lan, beforeFen: newMove.before, score: null, senderId: userData.id, gameId: data.id });
            makeRandomMove()
            return true
        } catch {
            // do nothing
        }

        // reset the promotion move to clear the promotion dialog
        setPromotionMove(null);
    }

    // calculate the left position of the promotion square
    const squareWidth = typeof window !== 'undefined' ? document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect()?.width ?? 0 : 0;
    const promotionSquareLeft = promotionMove?.targetSquare ? squareWidth * chessColumnToColumnIndex(promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? '', 8,
        // number of columns
        'white' // board orientation
    ) : 0;
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
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        height: '850px',
        justifyContent: 'space-between'
    }}>
        <div style={{
            position: 'relative'
        }}>
            {promotionMove ? <div onClick={() => setPromotionMove(null)} onContextMenu={e => {
                e.preventDefault();
                setPromotionMove(null);
            }} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                zIndex: 1000
            }} /> : null}

            {promotionMove ? <div style={{
                position: 'absolute',
                top: 0,
                left: promotionSquareLeft,
                backgroundColor: 'white',
                width: squareWidth,
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)'
            }}>
                {(['q', 'r', 'n', 'b'] as PieceSymbol[]).map(piece => <button key={piece} onClick={() => {
                    onPromotionPieceSelect(piece);
                }} onContextMenu={e => {
                    e.preventDefault();
                }} style={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    {defaultPieces[`w${piece.toUpperCase()}` as keyof PieceRenderObject]()}
                </button>)}
            </div> : null}

            <Chessboard options={{
                onSquareRightClick,
                canDragPiece,
                position: position,
                onPieceDrop,
                onSquareClick,
                squareStyles: { ...squareOptions, ...squareStyles },
                showAnimations,
                id: 'play-vs-random',
                boardStyle: { width: '720px', height: '720px' },
            }} />
        </div>


    </div>;

}

export default ChessboardCopmonent