'use client'
import { getSocket } from "@/app/libs/sockets"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { Chess, PieceSymbol, Square } from "chess.js"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Chessboard, chessColumnToColumnIndex, fenStringToPositionObject, PieceDropHandlerArgs, PieceHandlerArgs, PieceRenderObject, SquareHandlerArgs, defaultPieces, DraggingPieceDataType } from "react-chessboard"
import { Person2 } from '@mui/icons-material';
import { GAME_STATUS, GAME_TYPE, GameAttributes, MoveAttributes, Player, ProfileAttributes } from "../types/types"
import { createNewGameMoves, updateElo, updateGameDrawResult, updateGameSpecificResult } from "../services"
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BalanceIcon from '@mui/icons-material/Balance';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GppBadIcon from '@mui/icons-material/GppBad';


const DrawResult = ({ me, handleGetCorrectElo }: { me: { color: string, myInformation: Player, opponent: Player }, handleGetCorrectElo: () => { userElo: number | undefined, opponentElo: number | undefined } }) => {
    const { userElo, opponentElo } = handleGetCorrectElo()

    return (
        <div className="flex flex-col absolute w-1/2 h-1/2 general-backgroundcolor p-5 text-white gap-2 rounded xl">
            <div className="w-full p-5 flex items-center justify-center bg-[#302e2b] font-bold text-white text-2xl">
                Draw
            </div>
            <div className="w-full flex justify-center items-center gap-1 text-white p-2">
                <div className='w-1/2 flex flex-col items-center gap-2'>
                    <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />

                    </div>
                    <div className='font-bold'>{me.myInformation.name}</div>
                    <div className="text-sm opacity-50">{userElo} + 0</div>
                </div>
                <BalanceIcon sx={{ fontSize: 30, color: 'white' }} />
                <div className='w-1/2 flex flex-col items-center gap-2'>
                    <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div className='font-bold'>{me.opponent.name}</div>
                    <div className="text-sm opacity-50">{opponentElo} + 0</div>
                </div>
            </div>
            <div className='cursor-pointer w-full p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <RestartAltIcon sx={{ fontSize: 30 }} />
                <div className='font-bold text-lg'>Play Again</div>
            </div>
            <div className='cursor-pointer w-full p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <AddIcon sx={{ fontSize: 30 }} />
                <div className='font-bold text-lg'>New Game</div>
            </div>
        </div>
    )
}

const SpecificResult = ({ me, isWinner, handleGetCorrectElo }:
    {
        me: { color: string, myInformation: Player, opponent: Player },
        isWinner: boolean,
        handleGetCorrectElo: () => { userElo: number | undefined, opponentElo: number | undefined }
    }) => {

    const { userElo, opponentElo } = handleGetCorrectElo()
    return (
        <div className="flex flex-col absolute w-1/2 h-3/5 general-backgroundcolor p-5 text-white gap-2 rounded-xl ">
            <div className="w-full p-5 flex items-center justify-center bg-[#302e2b] font-bold text-white text-2xl">
                {isWinner ? 'You win' : 'You lost'}
            </div>
            <div className="w-full flex justify-center items-center gap-1 text-white p-2">
                <div className='w-1/2 flex flex-col items-center gap-2'>
                    <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />

                    </div>
                    <div className='font-bold'>{me.myInformation.name}</div>
                    <div className="text-sm opacity-50">{userElo}</div>
                </div>
                {isWinner ? <EmojiEventsIcon sx={{ fontSize: 30 }} /> : <GppBadIcon sx={{ fontSize: 30 }} />}
                <div className='w-1/2 flex flex-col items-center gap-2'>
                    <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div className='font-bold'>{me.opponent.name}</div>
                    <div className="text-sm opacity-50">{opponentElo}</div>
                </div>
            </div>
            <div className='cursor-pointer w-full p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <RestartAltIcon sx={{ fontSize: 30 }} />
                <div className='font-bold text-lg'>Play Again</div>
            </div>
            <div className='cursor-pointer w-full p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <AddIcon sx={{ fontSize: 30 }} />
                <div className='font-bold text-lg'>New Game</div>
            </div>
        </div>
    )
}

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
    const [isDraw, setisDraw] = useState(false)
    ///Manage winner, loser
    const [isWinner, setIsWinner] = useState(false)
    ///Manage checkmate
    const [isCheckmate, setIsCheckmate] = useState(false)
    ///Game id params
    const { id }: { id: string } = useParams()
    ///
    ///Manage the game information, to know who is the player, who is the opponent and the details of both.
    const me: { color: string, opponent: Player, myInformation: Player } = {
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
    ///Manage the countdown for the player time
    const timeRef = useRef(me.myInformation.timeLeft)
    const [myDisplayTime, setMyDisplayTime] = useState(timeRef.current)
    ///Manage the countdown for the opponentTimeRef
    const opponentTimeRef = useRef(me.opponent.timeLeft)
    const [opponentDisplayTime, setOpponentDisplayTime] = useState(opponentTimeRef.current)

    const createNewMoveMutation = useMutation({
        mutationKey: ['create_new_move'],
        mutationFn: createNewGameMoves,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [`moves_game_${id}`] })
            console.log(data)
            socket.emit('new_move_history', me.opponent.id)
        }
    })

    const updateEloMutation = useMutation({
        mutationKey: ['update_elo'],
        mutationFn: updateElo,
        onSuccess: (data) => {
            console.log('after update elo', data)
            queryClient.invalidateQueries({ queryKey: [`current_user`] })
            queryClient.invalidateQueries({ queryKey: [`game ${id}`] })
        },
        onError: (error) => {
            console.log('Error', error)
        }
    })

    const updateDrawResultMutation = useMutation({
        mutationKey: ['update_draw_result'],
        mutationFn: updateGameDrawResult
    })

    const updateSpecificResultMutation = useMutation({
        mutationKey: ['update_specific_result'],
        mutationFn: updateGameSpecificResult
    })


    const handleDrawResult = () => {
        console.log('It is working 3')
        setisDraw(true)
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

    useEffect(() => {
        console.log('It is working 1')
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
            const elapsedSeconds = Math.floor((currentTime - lastOpponentMoveTime) / 1000) ///Calculate the elapsed time from the last move time above with the current time
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

    }, [data?.fen])

    useEffect(() => {
        socket.on('new_move_history', () => {
            queryClient.invalidateQueries({ queryKey: [`moves_game_${id}`] })
            queryClient.refetchQueries({ queryKey: [`moves_game_${id}`] })
        })
        if (data?.fen) {
            ///If the data fen change, set it again
            setChessState(data.fen)
            chessGame.load(data.fen)
        }
        const handleFenUpdate = async (fen: string) => {
            ///If the fen have update, set the chess current state to the new fen
            setChessState(fen);
            console.log('INVALIDATE ')
            chessGame.load(fen)
            ///If there are premoves, handle the premoves
            handlePremove()
        };
        ///Listen to the board state change
        socket.on('board_state_change', handleFenUpdate);

        ///If there are time update, listen to it
        const handleTimeUpdate = (res: GameAttributes) => {
            ///If the time change, it means that last move time and the time left change
            ///So that we need to refetch the game ID
            queryClient.invalidateQueries({ queryKey: [`game ${id}`] })
            ///Set me attributes to new Game attributes after update to update the UI correctly
            ///Set our timeLeft and opponent timeLeft to the new timeLeft if there are changes.
            timeRef.current = userData.id === res.player1Id ? res.player1TimeLeft : res.player2TimeLeft
            opponentTimeRef.current = userData.id === res.player1Id ? res.player2TimeLeft : res.player1TimeLeft
            setMyDisplayTime(timeRef.current)
            setOpponentDisplayTime(opponentTimeRef.current)
        }
        socket.on('game_time_update', handleTimeUpdate)


        return () => {
            ///Clean up the socket for not leaking data
            socket.off('board_state_change', handleFenUpdate);
            socket.off('game_time_update', handleTimeUpdate)

        };
    }, [data?.fen]);

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

    const formatSecondsToMMSS = (seconds: number) => {
        ///Format the Time left to the mm:ss for displaying
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    }

    function positionToFen(position: Record<string, { pieceType: string }>): string {
        ///Because the premove make the position of the board not only depends on the chessState, but also the premoves
        ///We have to do this so when the opponent move many premoves, it will not happen the mismatch between the eaten piece.
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

    const getMoveOptions = (square: Square) => {
        ///Get the move options of the current square
        const validMoves = chessGame.moves({
            square: square,
            verbose: true
        })
        ///If there are not, return false
        if (validMoves.length === 0) {
            return false
        }
        ///If there are, change the square style of it
        const newSquare: Record<string, React.CSSProperties> = {}
        for (const move of validMoves) {
            ///Check if the move.to have the opponent piece, if it is, then we will have larger circle for it
            newSquare[move.to] = {
                background: chessGame.get(move.to) && chessGame.get(move.to)?.color !== chessGame.get(square)?.color ?
                    'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%',
            }
        }
        ///Change the style of the chosen square
        newSquare[square] = { background: 'rgba(255, 255, 0, 0.4)', }
        ///Displaying square
        setSquareOptions(newSquare)
        return true
    }

    const promotionCheck = ({ targetSquare, piece }: PieceDropHandlerArgs) => {
        ///Check for promotion, if there are no targetSquare, return false
        if (!targetSquare) return false
        ///If the chosen piece is not a Pawn, return false
        if (!piece || piece.pieceType[1] !== 'P') return false;
        ///Dependings on the color to check if the pawn need to go to row 8 or row 1 on the board.
        return me.color === 'w' ? targetSquare.match(/\d+$/)?.[0] === '8' : targetSquare.match(/\d+$/)?.[0] === '1'
    }

    const handlePromotionTurn = ({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string }) => {
        ///Check for all the valid moves of the chosen square
        const possibleMoves = chessGame.moves({
            square: sourceSquare as Square,
            verbose: true
        });
        // check if target square is in possible moves (accounting for promotion notation)
        // If there are, setThePromotion to display the board for choosing promotion type
        if (possibleMoves.some(move => move.to === targetSquare)) {
            setPromotionMove({
                sourceSquare,
                targetSquare
            });
        }

        // return true so that the promotion move is not animated
        // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
    }

    function getValidMovesRegardlessOfTurn(game: Chess, square: string) {
        ///Get valid moves even when it is not our turn
        ///The purpose is to capture another opponent piece when premove
        ///Because the chess.moves() if it is not our turn, it will return nothing, that's why we need this function.
        const clone = new Chess(game.fen()); // clone current part

        if (clone.turn() !== me.color) {
            const fenParts = clone.fen().split(' ');
            fenParts[1] = me.color; // Change turn in fen
            clone.load(fenParts.join(' '));
        }

        return clone.moves({ square: square as Square, verbose: true });
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

            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[0], gameId: id, moverId: me.myInformation.id }
            createNewMoveMutation.mutate(newMove)
            console.log(newMove)
            ///Notify the board state change
            socket.emit('board_state_change', {
                opponentId: me.opponent?.id,
                roomId: id,
                fen: chessGame.fen(),
            })
            ///Update the time
            socket.emit('game_time_update', { newLeftTime: timeRef.current, gameId: id, opponentId: me.opponent.id })
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
            if (promotionCheck({ sourceSquare, targetSquare, piece })) {
                ///If it is a promotion in premove, create a temporary chess game with new fen which include the premoves.
                const tempChessGame = new Chess(positionToFen(position))
                ///Get valid moves regardless of turn, to get the valid move for the premove.
                const possibleMoves = getValidMovesRegardlessOfTurn(tempChessGame, sourceSquare)
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
        if (promotionCheck({ sourceSquare, targetSquare, piece })) {
            // If it is not a premove and it is a promotion move, then handle promotion normally
            // get all possible moves for the source square
            handlePromotionTurn({ sourceSquare, targetSquare })

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
            const hasMoveOptions = getMoveOptions(square as Square)
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
            const hasMoveOptions = getMoveOptions(square as Square)
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
        if (promotionCheck({ sourceSquare: currentPiece, targetSquare: square, piece: chosenPieceToDraggingPieceDataType })) {
            // If it is not a premove and it is a promotion move, then handle promotion normally
            // get all possible moves for the source square
            handlePromotionTurn({ sourceSquare: currentPiece, targetSquare: square })

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

        if (chessGame.turn() !== me.color) {
            if (!promotionMove) return
            premovesRef.current.push({
                sourceSquare: promotionMove?.sourceSquare,
                targetSquare: promotionMove?.targetSquare,
                piece: {
                    pieceType: me.color + piece.toUpperCase(),
                    isSparePiece: false,
                    position: promotionMove?.sourceSquare
                },
            })

            setPremoves([...premovesRef.current])
            setPromotionMove(null);
            return;
        }
        try {
            chessGame.move({
                from: promotionMove!.sourceSquare,
                to: promotionMove!.targetSquare as Square,
                promotion: piece
            });

            // update the game state
            setChessState(chessGame.fen())
            setCurrentPiece('')
            setSquareOptions('')
            const newMove: MoveAttributes = { ...chessGame.history({ verbose: true })[0], gameId: id, moverId: me.myInformation.id }
            createNewMoveMutation.mutate(newMove)
            socket.emit('board_state_change', {
                opponentId: me.opponent?.id,
                roomId: id,
                fen: chessGame.fen(),
            });
            socket.emit('game_time_update', { newLeftTime: timeRef.current, gameId: id, opponentId: me.opponent.id })
        } catch {
            // do nothing
        }

        // reset the promotion move to clear the promotion dialog
        setPromotionMove(null);
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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            height: '850px',
            justifyContent: 'space-between'
        }} >
            <div className="w-full flex justify-between">
                <div className="flex gap-3">
                    <div className='w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div>
                        <div className="font-bold text-white">{me.opponent?.name}</div>
                        <div className="text-white opacity-50">{handleGetCorrectElo().opponentElo}</div>
                    </div>
                </div>
                <div className={`w-[100px] flex bg-white/80 justify-center items-center  text-xl font-bold ${chessGame.turn() === me.color && 'opacity-50'}`}>
                    {opponentDisplayTime ? formatSecondsToMMSS(opponentDisplayTime) : '00:00'}
                </div>
            </div>

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

                <Chessboard options={{
                    allowDragging,
                    canDragPiece,
                    position,
                    onPieceDrop,
                    onSquareClick,
                    onSquareRightClick,
                    showAnimations,
                    squareStyles: { ...squareOptions, ...squareStyles },
                    id: 'play-vs-random',
                    boardStyle: { width: '720px', height: '720px' },
                    boardOrientation: me.color === 'w' ? 'white' : 'black',
                }} />
                {isDraw && isGameOver && <DrawResult me={me} handleGetCorrectElo={handleGetCorrectElo} />}
                {isGameOver && isCheckmate && <SpecificResult me={me} isWinner={isWinner} handleGetCorrectElo={handleGetCorrectElo} />}
            </div>
            <div className="w-full flex justify-between">
                <div className="flex gap-3">
                    <div className='w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div>
                        <div className="font-bold text-white">{me.myInformation?.name}</div>
                        <div className="text-white opacity-50">{handleGetCorrectElo().userElo}</div>
                    </div>
                </div>
                <div className={`w-[100px] flex bg-white/80 justify-center items-center  text-xl font-bold ${chessGame.turn() !== me.color && 'opacity-50'}`}>
                    {myDisplayTime ? formatSecondsToMMSS(myDisplayTime) : '00:00'}
                </div>
            </div>
        </div>
    )
}

export default ChessPvP