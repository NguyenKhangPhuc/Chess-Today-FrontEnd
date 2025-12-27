// **Overview**
// ------------
// This file defines the workflow and logic for the **Player vs Player (PVP) Chess** page.  
// It covers:
// - Matchmaking
// - Chess move handling
// - Player interaction via sockets
// - Premove logic
// - Promotion handling
// - Real-time time control
// - Game over conditions

// **Workflow**
// ------------
// 1. **Matchmaking**
//    - When a player joins the queue, they are matched with another queued player.
//    - Matchmaking is handled in the **backend**.
//    - Once matched, both players are redirected to the **chess game page** with game info.

// 2. **Move Handling**
//    - Users can move pieces in **two ways**:
//      - **Drag & Drop** → handled by `onPieceDrop`
//      - **Click & Select** → handled by `onSquareClick`
//    - **Promotion handling** → `onPromotionPieceSelect`
//    - **Move options display** → `hasMoveOptions`
//    - These functions integrate with **react-chess-board**, while the **game logic** is powered by **chess.js**.

// 3. **Player Interaction**
//    - When a player makes a valid move:
//      - Call `.move` from **chess.js**
//      - Update board state
//      - Clear move options & promotion piece state
//      - Create a new move entry using `.history` from **chess.js**
//      - Save move into the database (via mutation)
//      - Send updated board state to the opponent via **socket**
//    - The opponent updates their board state and executes any pending **premove**.

// 4. **onSquareClick Behavior**
//    - If no piece was previously selected:
//      - Check if the clicked square contains a piece
//      - If yes, call `hasMoveOptions` to highlight valid moves
//    - If a piece was already selected:
//      - If the new square is a valid move → call `.move` and handle as usual
//      - If the new square is invalid & empty → reset move options
//      - If the new square has another piece → check new move options and set it as the active piece

// 5. **Promotion**
//    - A promotion check (`promotionCheck`) is run in both `onSquareClick` and `onPieceDrop`.
//    - If the move is a promotion:
//      - Set `promotionPiece` containing move details
//      - Show **promotion selection popup**
//      - Once the user selects a piece:
//        - Call `onPromotionPieceSelect`
//        - Execute `.move` with the chosen promotion piece
//        - Continue with standard move handling

// 6. **Premove**
//    - If a player attempts a move when it’s **not their turn** → treat it as a **premove**.
//    - Logic:
//      - Store premoves in:
//        - `useRef` (for internal tracking)
//        - `useState` (for UI updates)
//      - Highlight premove with **red color**
//      - Upon receiving opponent’s move (via socket):
//        - Extract earliest premove from array
//        - Try `.move` → if valid, apply it and update state
//        - If invalid, clear all premoves (reset both useRef & useState arrays)
//    - **Important**: premoves are **only supported in `onPieceDrop`** (not in `onSquareClick`).
//    - **Promotion + Premove**:
//      - Check with `promotionCheck`
//      - If valid, set `promotionPiece` and show selection popup
//      - Once selected, push promotion premove into premove array and update UI

// 7. **Time Management**
//    - Both players have a **real-time clock** tracked in the database:
//      - `timeLeft`
//      - `lastMoveTimestamp`
//    - On frontend:
//      - Use `useEffect` to check whose turn it is
//      - If it’s **my turn**:
//        - Calculate **elapsed time** since opponent’s last move
//        - Subtract elapsed time from my `timeLeft`
//        - Start countdown with `setInterval`
//      - If it’s **opponent’s turn**:
//        - Do the same calculation for opponent’s `timeLeft`
//    - This prevents **cheating by reload** (time is synced with DB).
//    - For example. Let say my move is at 10h 0m 30s and it is opponent turn. They have 60 seconds timeLeft.
//    - For real-time clock. We can calculate the current time, let say 10h 0m 35s, then we will have the elapsed time which is 5s.
//    - After that we will extract the elapsed time from the opponent's timeLeft to have a realtime clock.
//    - After every move:
//      - Save `timeLeft` and `lastMoveTimestamp` into the database

// 8. **Game Over Conditions**
//    - If a player’s time runs out:
//      - Check if the losing player has **sufficient material** to checkmate
//        - If yes → declare **draw**
//        - If no → declare **loss**
//    - On checkmate/stalemate:
//      - Stop the game
//      - Update **win/loss/draw status**
//      - Recalculate **ELO rating**

// **Summary**
// -----------
// This page coordinates:
// - **Frontend board interactions** (via react-chess-board)
// - **Game rules & validation** (via chess.js)
// - **State synchronization** (via sockets + database)
// - **Fair play mechanics** (time control & premoves)

'use client'
import { getSocket } from "@/app/libs/sockets"
import { QueryClient } from "@tanstack/react-query"
import { Chess, PieceSymbol, Square } from "chess.js"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { Chessboard, chessColumnToColumnIndex, fenStringToPositionObject, PieceDropHandlerArgs, PieceHandlerArgs, PieceRenderObject, SquareHandlerArgs, defaultPieces, DraggingPieceDataType } from "react-chessboard"
import { Player, ProfileAttributes } from "../types/user"
import { GameAttributes } from "../types/game"
import { GAME_STATUS, GAME_TYPE } from "../types/enum"
import { MoveAttributes } from "../types/move"
import { getMoveOptions, getValidMovesRegardlessOfTurn, handlePromotionInPremoves, handlePromotionTurn, positionToFen, promotionCheck } from "../helpers/chess-general"
import SpecificResult from "./SpecificResult"
import DrawResult from "./DrawResult"
import { PlayerBar } from "./PlayerBar"
import { useUpdateElo } from "../hooks/mutation-hooks/useUpdateElo"
import { useCreateNewMove } from "../hooks/mutation-hooks/useCreateNewMove"
import { useUpdateDrawResult } from "../hooks/mutation-hooks/useUpdateDrawResult"
import { useUpdateSpecificResult } from "../hooks/mutation-hooks/useUpdateSpecificResult"
import React from "react"

const ChessPvP = ({ data, userData, queryClient }: { data: GameAttributes, userData: ProfileAttributes, queryClient: QueryClient }) => {
    ///Manage socket
    const socket = getSocket()
    ///To invalidate query when doing mutation
    ///Mange chess game
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    ///Manage chessboard fen UI
    const [chessState, setChessState] = useState(chessGame.fen())
    ///Manage the chosen piece when click on piece
    const [currentPiece, setCurrentPiece] = useState('')
    ///Manage the square styles options for premoves and for clicked pieces
    const [squareOptions, setSquareOptions] = useState({})
    ///Mange the user's premoves
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([])
    const premovesRef = useRef<PieceDropHandlerArgs[]>([])
    ///Mange the animation 
    const [showAnimations, setShowAnimations] = useState(true)
    ///Manage the promotion move
    const [promotionMove, setPromotionMove] = useState<Omit<PieceDropHandlerArgs, 'piece'> | null>(null);
    ///Manage the game time out
    const [isTimeOut, setIsTimeOut] = useState(false)
    ///Manage the allow dragging pieces
    const [allowDragging, setAllowDragging] = useState(true)
    ///Manage game over
    const [isGameOver, setIsGameOver] = useState(chessGame.isGameOver())
    ///Manage draw pop up
    const [isDraw, setIsDraw] = useState(false)
    ///Manage winner, loser
    const [isWinner, setIsWinner] = useState(false)
    ///Manage checkmate
    const [isCheckmate, setIsCheckmate] = useState(false)
    ///Game id params
    const { id }: { id: string } = useParams()
    ///Manage the game information, to know who is the player, who is the opponent and the details of both.
    const me: { color: string, opponent: Player, myInformation: Player } = useMemo(() => {
        return {
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
    }, [data])
    ///Manage the countdown for the player time
    const timeRef = useRef(me.myInformation.timeLeft)
    const [myDisplayTime, setMyDisplayTime] = useState(timeRef.current)
    ///Manage the countdown for the opponentTimeRef
    const opponentTimeRef = useRef(me.opponent.timeLeft)
    const [opponentDisplayTime, setOpponentDisplayTime] = useState(opponentTimeRef.current)

    const { createNewMoveMutation } = useCreateNewMove({ gameId: id, socket: socket, opponentId: me.opponent.id, queryClient: queryClient })

    const { updateEloMutation } = useUpdateElo({ queryClient, id });

    const { updateDrawResultMutation } = useUpdateDrawResult()

    const { updateSpecificResultMutation } = useUpdateSpecificResult()
    console.log(myDisplayTime)
    console.log('is game reload', me)
    useEffect(() => {
        if (data.fen != null) {
            chessGame.load(data.fen)
            setChessState(chessGame.fen())
            console.log("Fen: ", data.fen)
        }
        console.log(me)
        const handleFenUpdate = async (fen: string) => {
            ///If the fen have update, set the chess current state to the new fen
            chessGame.load(fen)
            setChessState(chessGame.fen());
            ///If there are premoves, handle the premoves
            handlePremove()
        };
        const handleTimeUpdate = (res: GameAttributes) => {
            ///If the time change, it means that last move time and the time left change
            ///So that we need to refetch the game ID
            ///Set me attributes to new Game attributes after update to update the UI correctly
            ///Set our timeLeft and opponent timeLeft to the new timeLeft if there are changes.
            timeRef.current = userData.id === res.player1Id ? res.player1TimeLeft : res.player2TimeLeft
            opponentTimeRef.current = userData.id === res.player1Id ? res.player2TimeLeft : res.player1TimeLeft
            console.log(timeRef.current, "My time")
            console.log("Opponent time", opponentTimeRef.current);
            setMyDisplayTime(timeRef.current)
            setOpponentDisplayTime(opponentTimeRef.current)
        }

        const handleBoardStateChange = (updatedGame: GameAttributes) => {
            console.log(updatedGame);
            handleFenUpdate(updatedGame.fen)
            handleTimeUpdate(updatedGame)
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: [`game_${id}`] })
                queryClient.refetchQueries({ queryKey: [`moves_game_${id}`] })
            }, 300)
        }

        ///Listen to the board state change
        socket.on('board_state_change', handleBoardStateChange);

        ///If there are time update, listen to it


        return () => {
            ///Clean up the socket for not leaking data
            socket.off('board_state_change', handleBoardStateChange);

        };
    }, []);

    useEffect(() => {
        if (chessGame.isGameOver() === true) {
            console.log('It is working 2')
            setIsGameOver(true)

            if (chessGame.isDraw()) {
                handleDrawResult()
            } else {
                handleSpecificResult(null)
            }
        }
    }, [chessState])

    useEffect(() => {
        if (chessGame.isGameOver()) return
        if (chessGame.turn() !== me.color) {
            ///If this isnt the player turn, start to count down the opponent time
            const myLastMoveTime = new Date(me.opponent.lastOpponentMove).getTime() ///Last move time of the player(not the opponent)
            const currentTime = Date.now() ///Get the current time
            const elapsedSeconds = Math.floor((currentTime - myLastMoveTime) / 1000) ///Calculate the gone time from the last move time above to the current time, to not cheat on time when reload.
            opponentTimeRef.current -= elapsedSeconds ///Calculate the time left by minus the timeLeft of the opponent with the elapsed time.
            const interval = setInterval(() => {
                if (chessGame.isGameOver()) {
                    clearInterval(interval)
                    return
                }
                ///Start the interval, After getting the real time, start to minus 1 each 1 second
                opponentTimeRef.current -= 1
                ///Display the opponent time on our board
                setOpponentDisplayTime(opponentTimeRef.current)
                if (opponentTimeRef.current <= 0) {
                    /// If the opponent time = 0, remove the interval, and handle time out
                    clearInterval(interval)
                    handleIsTimeOut(false)
                    return
                }
            }, 1000)
            return () => clearInterval(interval);
        } else {
            const lastOpponentMoveTime = new Date(me.myInformation.lastOpponentMove).getTime() ///Get the last move time of our opponent
            const currentTime = Date.now() ///Calculate the current time
            console.log("Opponent last move time", me.myInformation.lastOpponentMove, "--- current:", new Date());
            const elapsedSeconds = Math.floor((currentTime - lastOpponentMoveTime) / 1000) ///Calculate the elapsed time from the last move time above with the current time
            console.log("elapsed time ", elapsedSeconds)
            timeRef.current -= elapsedSeconds ///Minus our timeLeft with the elapsed time for not cheating time with reload
            const interval = setInterval(() => {
                if (chessGame.isGameOver()) {
                    clearInterval(interval)
                    return
                }
                ///Start the interval, After getting the real time, start to minus 1 each 1 second
                timeRef.current -= 1
                ///Display our time on our board
                setMyDisplayTime(timeRef.current)
                if (timeRef.current <= 0) {
                    /// If the our time = 0, remove the interval, and handle time out
                    clearInterval(interval)
                    handleIsTimeOut(true)
                    return
                }
            }, 1000)
            return () => clearInterval(interval);
        }
    }, [data.fen])

    const handleDrawResult = () => {
        console.log('It is working 3')
        setIsDraw(true)
        updateDrawResultMutation.mutate(id)
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

    const handleSpecificResult = (isMeTimeOut: boolean | null) => {
        const { userElo } = handleGetCorrectElo()
        if (!userElo) {
            console.log('No user elo')
            return
        }
        if (isMeTimeOut !== null) {
            setIsCheckmate(true)
            setIsWinner(!isMeTimeOut)
            updateSpecificResultMutation.mutate({
                gameId: id,
                winnerId: isMeTimeOut ? me.opponent.id : me.myInformation.id,
                loserId: isMeTimeOut ? me.myInformation.id : me.opponent.id
            })
            if (isMeTimeOut) {
                updateEloMutation.mutate({ gameType: data.gameType, userElo: userElo - 8 })
            } else {
                updateEloMutation.mutate({ gameType: data.gameType, userElo: userElo + 8 })
            }
        } else {
            setIsCheckmate(true)
            if (chessGame.turn() !== me.color) {
                console.log('It is working 4', { gameId: id, winnerId: me.myInformation.id, loserId: me.opponent.id })
                setIsWinner(true);
                updateSpecificResultMutation.mutate({ gameId: id, winnerId: me.myInformation.id, loserId: me.opponent.id })
                if (data.gameStatus !== GAME_STATUS.FINISHED) {
                    updateEloMutation.mutate({ gameType: data.gameType, userElo: userElo + 8 })
                }
            } else {
                if (data.gameStatus !== GAME_STATUS.FINISHED) {
                    console.log('CHeck check check,', { gameType: data.gameType, userElo: userElo - 8 })
                    updateEloMutation.mutate({ gameType: data.gameType, userElo: userElo - 8 })
                }
            }
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

    const isSufficentCheckmateMaterial = (isMeTimeOut: boolean) => {
        ///Check if there are sufficient piece for check mate of the timeout candidate
        let boardType;
        ///Get the correct piece color type depend on the timeout candidate
        if (isMeTimeOut) {
            boardType = me.color === 'w' ? chessGame.board()[1] : chessGame.board()[0]
        } else {
            boardType = me.color === 'w' ? chessGame.board()[0] : chessGame.board()[1]
        }
        ///Get the all the piece type on the board
        const pieceLeft = boardType.map((e) => {
            return e?.type
        })
        ///Check if there is a queen or a rook or a pawn on the board
        const isQueenOrRookOrPawnAlive = pieceLeft.some(e => e === 'q' || e === 'r' || e === 'p')
        if (isQueenOrRookOrPawnAlive) return true;
        ///Count the bishops on the board
        const bishopsCount = pieceLeft.filter(e => e === 'b').length
        ///Count the knights on the board
        const knightCount = pieceLeft.filter(e => e === 'n').length
        ///If there are sufficient bishops or knightCount return true.
        if (bishopsCount >= 2) return true;
        if (knightCount >= 2) return true;
        if (bishopsCount >= 1 && knightCount >= 1) return true;
        return false
    }

    const handleIsTimeOut = (isMeTimeOut: boolean) => {
        setIsGameOver(true)
        ///Check the timeout candidate if they has sufficent matierial 
        ///Check the other not timeOut candidate.
        ///Candidate can be current player or their opponent
        const isTimeOutQualified = isSufficentCheckmateMaterial(isMeTimeOut)
        const isOtherQualified = isSufficentCheckmateMaterial(!isMeTimeOut)
        ///If the timeout candidate still have enough material for checkmate, and the other not, then it is a draw
        console.log(isTimeOutQualified, isOtherQualified, isMeTimeOut)
        if (isTimeOutQualified && !isOtherQualified) {
            handleDrawResult()
        } else {
            handleSpecificResult(isMeTimeOut)
        }
        ///Set Timeout and allowDragging to make the player not be able to move the material anymore.
        setIsTimeOut(true)
        setAllowDragging(false)
    }

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
            ///If it is a normal move, handle it normally
            chessGame.move({
                from: sourceSquare!,
                to: targetSquare!,
                promotion: piece.pieceType[1].toLowerCase()
            })
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions({})
            setPromotionMove(null)
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[0], gameId: id, moverId: me.myInformation.id, playerTimeLeft: myDisplayTime }
            // console.log(newMove)
            // Notify the board state change
            socket.emit('board_state_change', {
                opponentId: me.opponent?.id,
                roomId: id,
                fen: chessGame.fen(),
                newTimeLeft: timeRef.current,
                newMove
            })
            return true
        } catch (err) {
            console.log(err)
            return false
        }

    }

    const onPieceDrop = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        if (!targetSquare || sourceSquare === targetSquare) {
            return false
        }
        const pieceColor = me.color;
        /// Check if it is a premove
        if (chessGame.turn() !== pieceColor) {
            /// Check if it is a promotion in a premove
            if (promotionCheck({ targetSquare, piece, me })) {
                ///If it is a promotion in premove, create a temporary chess game with new fen which include the premoves.
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
                return true;
            }
            /// If it not then push it like normal premoves
            premovesRef.current.push({
                sourceSquare,
                targetSquare,
                piece
            })
            setPremoves([...premovesRef.current])
            return true;
        }
        if (promotionCheck({ targetSquare, piece, me })) {
            // If it is not a premove and it is a promotion move, then handle promotion normally
            // get all possible moves for the source square
            handlePromotionTurn({ sourceSquare, targetSquare, chessGame, setPromotionMove })

            // return true so that the promotion move is not animated
            // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
            return true;
        }
        ///If it not the above cases, handle the move normally
        return handleMove({ sourceSquare, targetSquare, piece })
    }

    const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
        if (isTimeOut) return false
        ///If there is no chosen piece and no pieces in the square the play click, return
        if (!currentPiece && !piece) {
            return false
        }
        if (!currentPiece && piece) {
            ///If there is no chosen piece but there is a piece in the square player click
            ///Check if the piece color is the color of the player, if not return
            if (piece?.pieceType[0] && piece?.pieceType[0] !== me.color) {
                return false
            }
            ///Get the move options for the clicked piece
            const hasMoveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            setCurrentPiece(hasMoveOptions ? square : '')
            return false
        }
        ///If there is a chosen piece, then get the valid moves of the chosen piece
        const validMoves = chessGame.moves({
            square: currentPiece as Square,
            verbose: true,
        })
        ///Find if the square which the player click is the valid moves
        const foundMove = validMoves.find(m => m.to === square)
        if (!foundMove) {
            ///If it is not in the valid moves, then it have 2 cases
            ///One is the player click on empty square, another is click on another piece
            ///We check it by get the move options of the square the player click
            const hasMoveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            if (hasMoveOptions) {
                ///If there are move options, it demonstrate that the player click on another piece, we set the current piece to this piece
                setCurrentPiece(square)
            } else {
                ///If it not, then the player click on empty square, set the current piece to empty and clear the square styles
                setCurrentPiece('')
                setSquareOptions({})
            }

            return
        }
        const chosenPiece = chessGame.get(currentPiece as Square)!
        const chosenPieceToDraggingPieceDataType = {
            isSparePiece: false,
            pieceType: chosenPiece?.color + chosenPiece?.type.toUpperCase(),
            position: currentPiece,
        } as DraggingPieceDataType
        if (promotionCheck({ targetSquare: square, piece: chosenPieceToDraggingPieceDataType, me })) {
            // If it is not a premove and it is a promotion move, then handle promotion normally
            // get all possible moves for the source square
            handlePromotionTurn({ sourceSquare: currentPiece, targetSquare: square, chessGame, setPromotionMove })

            // return true so that the promotion move is not animated
            // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
            return true;
        }
        ///If it is a normal move, handle it normally
        return handleMove({ sourceSquare: currentPiece as Square, targetSquare: square as Square, piece: chosenPieceToDraggingPieceDataType })
    }

    const canDragPiece = ({ piece }: PieceHandlerArgs) => {

        return piece.pieceType[0] === me.color
    }

    const onSquareRightClick = () => {
        premovesRef.current = [];
        setPremoves([...premovesRef.current]);

        // disable animations while clearing premoves
        setShowAnimations(false);

        // re-enable animations after a short delay
        setTimeout(() => {
            setShowAnimations(true);
        }, 50);
    }

    function onPromotionPieceSelect(piece: PieceSymbol) {

        const result = handlePromotionInPremoves({ piece, chessGame, promotionMove, setPromotionMove, premovesRef, setPremoves, me })
        if (result) return result;
        const chosenPiece = chessGame.get(promotionMove?.sourceSquare as Square)!
        const chosenPieceToDraggingPieceDataType = {
            isSparePiece: false,
            pieceType: chosenPiece?.color + chosenPiece?.type.toUpperCase(),
            position: promotionMove?.sourceSquare,
        } as DraggingPieceDataType
        return handleMove({ sourceSquare: promotionMove!.sourceSquare, targetSquare: promotionMove!.targetSquare, piece: chosenPieceToDraggingPieceDataType })
    }
    const squareWidth = typeof window !== 'undefined' ? window.document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect()?.width ?? 0 : 0;
    const promotionSquareLeft = promotionMove?.targetSquare ? squareWidth * chessColumnToColumnIndex(promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? '', 8,
        // number of columns
        me.color === 'w' ? 'white' : 'black' // board orientation
    ) : 0;
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

    return (
        <div className='lg:h-[850px] md:h-[750px] flex flex-col items-center justify-between'>
            <PlayerBar name={me.opponent.name} elo={handleGetCorrectElo().opponentElo} isMyTurn={chessGame.turn() !== me.color} time={opponentDisplayTime ? formatSecondsToMMSS(opponentDisplayTime) : '00:00'} />

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
                    {(['q', 'r', 'n', 'b'] as PieceSymbol[]).map(piece => <button
                        key={piece}
                        onClick={() => { onPromotionPieceSelect(piece); }} onContextMenu={e => { e.preventDefault(); }}
                        style={{
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

                <div className="lg:w-[710px] lg:h-[710px] md:w-[600px] md:h-[600px] ">
                    <Chessboard options={{
                        allowDragging,
                        canDragPiece,
                        position,
                        onPieceDrop,
                        onSquareClick,
                        onSquareRightClick,
                        showAnimations,
                        squareStyles: { ...squareOptions, ...squareStyles },
                        id: `game-${id}`,
                        boardStyle: { width: '100%', height: '100%' },
                        boardOrientation: me.color === 'w' ? 'white' : 'black',
                        animationDurationInMs: 150
                    }} />
                </div>
                {isDraw && isGameOver && <DrawResult me={me} elo={handleGetCorrectElo()} setIsDraw={setIsDraw} setIsGameOver={setIsGameOver} />}
                {isGameOver && isCheckmate && <SpecificResult me={me} isWinner={isWinner} elo={handleGetCorrectElo()} setIsCheckmate={setIsCheckmate} setIsGameOver={setIsGameOver} />}
            </div>
            <PlayerBar name={me.myInformation.name} elo={handleGetCorrectElo().userElo} isMyTurn={chessGame.turn() === me.color} time={myDisplayTime ? formatSecondsToMMSS(myDisplayTime) : '00:00'} />
        </div>
    )
}

const ChessPvpMemo = React.memo(ChessPvP)

export default ChessPvpMemo