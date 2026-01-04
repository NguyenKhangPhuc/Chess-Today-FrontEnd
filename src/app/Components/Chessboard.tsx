
// Chess vs AI Page Workflow
// =========================

// Overview
// --------
// This file defines the workflow and logic for the **Chess vs AI** page.  
// It shares most logic with **PVP Chess** (move handling, promotion, move options)  
// but introduces **AI interaction** and **move explanation**.

// Workflow
// --------
// 1. Move Handling
//    - Users can move pieces in **two ways**:
//      - **Drag & Drop** → handled by `onPieceDrop`
//      - **Click & Select** → handled by `onSquareClick`
//    - **Promotion handling** → `onPromotionPieceSelect`
//    - **Move options display** → `hasMoveOptions`
//    - These functions integrate with **react-chess-board**, while the **game logic** is powered by **chess.js**.

// 2. After Player Move
//    - Once the player performs a valid `.move`:
//      - Update the board state
//      - Clear move options & promotion piece state
//      - Save move into database (via mutation)
//      - **NEW STEP (vs AI only):**
//        - Call **OpenAI** to generate an **explanation** of the player's move
//        - Show this explanation in the UI
//      - Trigger **createBotMove()**

// 3. AI Move
//    - `createBotMove()`:
//      - Calls the backend via **mutation**
//      - Backend uses **Stockfish** to compute best move
//      - Returns the bot's move
//    - `handleBotMove()`:
//      - Applies bot move using `.move`
//      - Updates the board state
//      - Clears move options & promotion piece state

// 4. Promotion
//    - Same logic as PVP:
//      - `promotionCheck` determines if the move is a promotion
//      - If yes, set `promotionPiece` and show selection popup
//      - When player selects piece, call `onPromotionPieceSelect`
//      - Execute promotion via `.move` and continue normal flow

// Differences from PVP
// --------------------
// - No matchmaking or socket interaction (only **one player vs AI**)
// - After every **human move**:
//   - Call OpenAI for **move explanation**
//   - Request bot move from backend via `createBotMove()`
//   - Apply AI move with `handleBotMove()`
// - All other board interactions (`onPieceDrop`, `onSquareClick`, 
//   `hasMoveOptions`, `onPromotionPieceSelect`) remain identical.

// Summary
// -------
// This page coordinates:
// - **Frontend board interactions** (via react-chess-board)
// - **Game rules & validation** (via chess.js)
// - **Move explanations** (via OpenAI)
// - **AI opponent moves** (via backend Stockfish engine)

'use client';
import { Chess, PieceSymbol, Square } from 'chess.js';
import React, { useEffect, useRef, useState } from "react";
import { Chessboard, chessColumnToColumnIndex, defaultPieces, DraggingPieceDataType, fenStringToPositionObject, PieceHandlerArgs, PieceRenderObject } from "react-chessboard";
import { PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';
import { QueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { CurrentUserInGameAttributes, GameAttributes } from '../types/game';
import { ProfileAttributes, UserBasicAttributes } from '../types/user';
import { MoveAttributes } from '../types/move';
import { EngineScore } from '../types/engine';
import { getMoveOptions, getValidMovesRegardlessOfTurn, handlePromotionInPremoves, handlePromotionTurn, positionToFen, promotionCheck, validatePromotionPiece } from '../helpers/chess-general';
import { PlayerBar } from './PlayerBar';
import { useCreateNewMove } from '../hooks/mutation-hooks/useCreateNewMove';
import { useUpdateGameFen } from '../hooks/mutation-hooks/useUpdateGameFen';
import { useGetExplanation } from '../hooks/mutation-hooks/useGetExplanation';
import { useBotMakeMove } from '../hooks/mutation-hooks/useBotMakeMove';
import SpecificResult from './SpecificResult';
import DrawResult from './DrawResult';
import { GAME_TYPE } from '../types/enum';
import { useUpdateSpecificResult } from '../hooks/mutation-hooks/useUpdateSpecificResult';
import { useUpdateDrawResult } from '../hooks/mutation-hooks/useUpdateDrawResult';


const ChessboardCopmonent = ({ data, userData, queryClient }: { data: GameAttributes, userData: UserBasicAttributes, queryClient: QueryClient }) => {
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen())
    const [currentPiece, setCurrentPiece] = useState('')
    const [squareOptions, setSquareOptions] = useState({})
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([]);
    const [showAnimations, setShowAnimations] = useState(true);
    const premovesRef = useRef<PieceDropHandlerArgs[]>([]);
    const [promotionMove, setPromotionMove] = useState<Omit<PieceDropHandlerArgs, 'piece'> | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isCheckmate, setIsCheckmate] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const { id }: { id: string } = useParams()
    const { updateSpecificResultMutation } = useUpdateSpecificResult();
    const { updateDrawResultMutation } = useUpdateDrawResult();
    const me: CurrentUserInGameAttributes = {
        color: userData?.id === data?.player1.id ? 'w' : 'b',
        opponent: userData?.id === data?.player1.id ?
            { ...data?.player2, timeLeft: data?.player2TimeLeft, lastOpponentMove: data?.player1LastMoveTime }
            :
            { ...data?.player1, timeLeft: data?.player1TimeLeft, lastOpponentMove: data?.player2LastMoveTime },
        myInformation: userData?.id === data?.player1.id ?
            { ...data?.player1, timeLeft: data?.player1TimeLeft, lastOpponentMove: data?.player2LastMoveTime }
            :
            { ...data?.player2, timeLeft: data?.player2TimeLeft, lastOpponentMove: data?.player1LastMoveTime },
    }

    const handleBotMove = (res: { moveInfo: { bestMove: string, score: EngineScore | undefined } }) => {
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
            const moveInfoIndex = chessGame.history({ verbose: true }).length >= 1 ? chessGame.history({ verbose: true }).length - 1 : 0
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[moveInfoIndex], gameId: id, moverId: botId, playerTimeLeft: 0, moveScore: res.moveInfo.score?.value }
            createNewMoveMutation.mutate(newMove)
            handlePremove()
        } catch {
            console.log('Error when AI move')
        }
    }
    const createBotMove = () => {
        if (chessGame.isGameOver()) {
            return null
        }
        botMakeMoveMutation.mutate({ fen: chessGame.fen(), gameId: data.id })
    }

    const handleGetCorrectElo = () => {
        let userElo;
        let opponentElo;
        if (data.gameType === GAME_TYPE.RAPID) {
            userElo = me.myInformation.elo
            opponentElo = me.opponent.elo
        } else if (data.gameType === GAME_TYPE.ROCKET) {
            userElo = me.myInformation.rocketElo
            opponentElo = me.opponent.rocketElo
        } else if (data.gameType === GAME_TYPE.BLITZ) {
            userElo = me.myInformation.blitzElo
            opponentElo = me.opponent.blitzElo
        }
        return { userElo, opponentElo }
    }

    const handleDrawResult = () => {
        setIsDraw(true)
    }
    const handleSpecificResult = (isMeTimeOut: boolean | null) => {
        setIsCheckmate(true)
        if (chessGame.turn() !== me.color) {
            setIsWinner(true);
            updateSpecificResultMutation.mutate({ gameId: id, winnerId: me.myInformation.id, loserId: me.opponent.id })
        } else {
            updateSpecificResultMutation.mutate({ gameId: id, winnerId: me.opponent.id, loserId: me.myInformation.id })
        }
    }
    const { updateGameFenMutation } = useUpdateGameFen(id);

    const { createNewMoveMutation } = useCreateNewMove({ gameId: id, socket: null, opponentId: null, queryClient })
    const { botMakeMoveMutation } = useBotMakeMove({ handleBotMove })
    const { getExplanationMutation } = useGetExplanation({ gameId: id, createBotMove, queryClient })
    useEffect(() => {
        if (data?.fen) {
            setChessState(data?.fen)
            chessGame.load(data?.fen)
        }
    }, [data])

    useEffect(() => {
        if (chessGame.isGameOver() === true) {
            setIsGameOver(true)

            if (chessGame.isDraw()) {
                handleDrawResult()
            } else {
                handleSpecificResult(null)
            }
        }
    }, [chessState])
    if (!userData || !data) return
    const botId = userData?.id === data?.player1Id ? data?.player2Id : data?.player1Id

    const handlePremove = () => {
        ///Handling the premove
        if (premovesRef.current.length > 0) {
            ///If there are premoves, take it out of the premoves array
            const nextPlayerPremove = premovesRef.current[0]
            premovesRef.current.splice(0, 1)
            setTimeout(() => {
                ///Try to move it
                const successfulMove = onPieceDrop(nextPlayerPremove)
                if (!successfulMove) {
                    ///If it is not a valid move, delete all premoves
                    premovesRef.current = [];
                }
                ///Set premoves to current premoves array
                setPremoves([...premovesRef.current])
                ///Disalbe the animations when premove
                setShowAnimations(false)
                setTimeout(() => {
                    setShowAnimations(true)
                }, 50)
            }, 300)
        }
    }

    const handleMove = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        try {
            chessGame.move({
                from: sourceSquare,
                to: targetSquare!,
                promotion: validatePromotionPiece(piece.pieceType[1].toLowerCase()) ? piece.pieceType[1].toLowerCase() as PieceSymbol : 'q'
            })
            updateGameFenMutation.mutate({ gameId: id, fen: chessGame.fen() });
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions({})
            setPromotionMove(null)
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[chessGame.history({ verbose: true }).length >= 1 ? chessGame.history({ verbose: true }).length - 1 : 0], gameId: id, moverId: userData.id, playerTimeLeft: 0 }
            createNewMoveMutation.mutate(newMove)
            getExplanationMutation.mutate({ move: newMove.lan, beforeFen: newMove.before, score: null, senderId: userData.id, gameId: data.id });
            return true
        } catch {
            return false
        }
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
            if (promotionCheck({ targetSquare, piece, me })) {
                // get all possible moves for the source square
                const tempChessGame = new Chess(positionToFen(position))
                ///Get valid moves regardless of turn, to get the valid move for the premove.
                const possibleMoves = getValidMovesRegardlessOfTurn({ game: tempChessGame, square: sourceSquare, me })

                // check if target square is in possible moves (accounting for promotion notation)
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
            premovesRef.current.push({
                sourceSquare,
                targetSquare,
                piece
            });
            setPremoves([...premovesRef.current]);
            // return early to stop processing the move and return true to not animate the move
            return true;
        }
        if (promotionCheck({ targetSquare, piece, me })) {
            handlePromotionTurn({ sourceSquare, targetSquare, chessGame, setPromotionMove })
            // return true so that the promotion move is not animated
            // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
            return true;
        }
        return handleMove({ sourceSquare, targetSquare, piece })

    }

    const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
        if (!currentPiece && !piece) {
            return false
        }
        if (!currentPiece && piece) {
            const hasMoveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            setCurrentPiece(hasMoveOptions ? square : '')
            return
        }

        const validMoves = chessGame.moves({
            square: currentPiece as Square,
            verbose: true,
        })

        const foundMove = validMoves.find(m => m.to === square)
        if (!foundMove) {
            const hasMoveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            setCurrentPiece(hasMoveOptions ? square : '')
            return
        }
        const chosenPiece = chessGame.get(currentPiece as Square)!
        const chosenPieceToDraggingPieceDataType = {
            isSparePiece: false,
            pieceType: chosenPiece?.color + chosenPiece?.type.toUpperCase(),
            position: currentPiece,
        } as DraggingPieceDataType
        if (promotionCheck({ targetSquare: square, piece: chosenPieceToDraggingPieceDataType, me })) {
            handlePromotionTurn({ sourceSquare: currentPiece, targetSquare: square, chessGame, setPromotionMove })
            return true;
        }
        return handleMove({ sourceSquare: currentPiece, targetSquare: square, piece: chosenPieceToDraggingPieceDataType })
    }


    function onPromotionPieceSelect(piece: PieceSymbol) {
        const result = handlePromotionInPremoves({ piece, chessGame, promotionMove, setPromotionMove, premovesRef, setPremoves, me })
        if (result) return result;
        const chosenPiece = chessGame.get(promotionMove?.sourceSquare as Square)!
        const chosenPieceToDraggingPieceDataType = {
            isSparePiece: false,
            pieceType: chosenPiece?.color + piece,
            position: promotionMove?.sourceSquare,
        } as DraggingPieceDataType
        return handleMove({ sourceSquare: promotionMove!.sourceSquare, targetSquare: promotionMove!.targetSquare, piece: chosenPieceToDraggingPieceDataType })
    }

    // calculate the left position of the promotion square
    const squareWidth = typeof window !== 'undefined' ? document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect()?.width ?? 0 : 0;
    const promotionSquareLeft = promotionMove?.targetSquare ? squareWidth * chessColumnToColumnIndex(promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? '', 8,
        // number of columns
        me.color === 'w' ? 'white' : 'black'  // board orientation
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
        return piece.pieceType[0] === me.color;
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
    return <div className=' lg:h-[850px] md:h-[750px] flex flex-col items-center justify-between '>
        <PlayerBar name={me.opponent.name} elo={undefined} isMyTurn={chessGame.turn() !== me.color} time={'Bot turn'} />
        <div style={{ position: 'relative' }} className="flex justify-center items-center">
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

            <div className='lg:w-[710px] lg:h-[710px] md:w-[600px] md:h-[600px]'>
                <Chessboard options={{
                    onSquareRightClick,
                    canDragPiece,
                    position: position,
                    onPieceDrop,
                    onSquareClick,
                    squareStyles: { ...squareOptions, ...squareStyles },
                    showAnimations,
                    id: 'play-vs-random',
                    boardStyle: { width: '100%', height: '100%' },
                    boardOrientation: me.color === 'w' ? 'white' : 'black',
                }} />
            </div>
            {isDraw && isGameOver && <DrawResult me={me} elo={handleGetCorrectElo()} setIsDraw={setIsDraw} setIsGameOver={setIsGameOver} />}
            {isGameOver && isCheckmate && <SpecificResult me={me} isWinner={isWinner} elo={handleGetCorrectElo()} setIsCheckmate={setIsCheckmate} setIsGameOver={setIsGameOver} />}
        </div>
        <PlayerBar name={me.myInformation.name} elo={undefined} isMyTurn={chessGame.turn() === me.color} time={'Your turn'} />
    </div >;
}

export default ChessboardCopmonent