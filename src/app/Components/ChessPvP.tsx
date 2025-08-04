'use client'
import { getSocket } from "@/app/libs/sockets"
import { QueryClient, QueryObserverResult, RefetchOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import { Chess, PieceSymbol, Square } from "chess.js"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Chessboard, chessColumnToColumnIndex, fenStringToPositionObject, PieceDropHandlerArgs, PieceHandlerArgs, PieceRenderObject, SquareHandlerArgs, defaultPieces, DraggingPieceDataType } from "react-chessboard"
import { getGame, getMe, updateTime } from "../services"
import { Person2 } from '@mui/icons-material';
import { GameAttributes, ProfileAttributes } from "../types/types"

const ChessPvP = ({ data, userData }: { data: GameAttributes, userData: ProfileAttributes }) => {
    const socket = getSocket()
    const queryClient = useQueryClient()
    const chessGameRef = useRef(new Chess())
    const chessGame = chessGameRef.current
    const [chessState, setChessState] = useState(chessGame.fen())
    const [currentPiece, setCurrentPiece] = useState('')
    const [squareOptions, setSquareOptions] = useState({})
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([])
    const [showAnimations, setShowAnimations] = useState(true)
    const premovesRef = useRef<PieceDropHandlerArgs[]>([])
    const [promotionMove, setPromotionMove] = useState<Omit<PieceDropHandlerArgs, 'piece'> | null>(null);
    const { id }: { id: string } = useParams()
    const [me, setMe] = useState({
        color: userData?.id === data?.player1.id ? 'w' : 'b',
        opponent: userData?.id === data?.player1.id ?
            { ...data?.player2, timeLeft: data?.player2TimeLeft, lastOpponentMove: data?.player1LastMoveTime }
            :
            { ...data?.player1, timeLeft: data?.player1TimeLeft, lastOpponentMove: data?.player2LastMoveTime },
        myInformation: userData?.id === data?.player1.id ?
            { ...data?.player1, timeLeft: data?.player1TimeLeft, lastOpponentMove: data?.player2LastMoveTime }
            :
            { ...data?.player2, timeLeft: data?.player2TimeLeft, lastOpponentMove: data?.player1LastMoveTime },
    })
    const timeRef = useRef(me.myInformation.timeLeft)
    const [myDisplayTime, setMyDisplayTime] = useState(timeRef.current)
    const opponentTimeRef = useRef(me.opponent.timeLeft)
    const [opponentDisplayTime, setOpponentDisplayTime] = useState(opponentTimeRef.current)


    console.log('data', data)
    console.log('me', me)
    console.log('myDisPlayTIme', timeRef.current)
    console.log('opponent display time', opponentTimeRef.current)
    useEffect(() => {
        if (chessGame.turn() !== me.color) {
            const myLastMoveTime = new Date(me.opponent.lastOpponentMove).getTime()
            console.log(myLastMoveTime)
            const currentTime = Date.now()
            console.log(currentTime)
            const elapsedSeconds = Math.floor((currentTime - myLastMoveTime) / 1000)
            console.log(elapsedSeconds)
            opponentTimeRef.current -= elapsedSeconds
            const interval = setInterval(() => {
                opponentTimeRef.current -= 1
                setOpponentDisplayTime(opponentTimeRef.current)
            }, 1000)
            return () => clearInterval(interval);
        } else {
            const lastOpponentMoveTime = new Date(me.myInformation.lastOpponentMove).getTime()
            console.log(lastOpponentMoveTime)
            const currentTime = Date.now()
            console.log(currentTime)
            const elapsedSeconds = Math.floor((currentTime - lastOpponentMoveTime) / 1000)
            console.log(elapsedSeconds)
            timeRef.current -= elapsedSeconds
            const interval = setInterval(() => {
                timeRef.current -= 1
                setMyDisplayTime(timeRef.current)

            }, 1000)
            return () => clearInterval(interval);
        }

    }, [data?.fen])

    useEffect(() => {
        if (data?.fen) {
            setChessState(data.fen)
            chessGame.load(data.fen)
        }
        const handleFenUpdate = async (fen: string) => {
            console.log('received FEN:', fen);
            setChessState(fen);
            chessGame.load(fen)
            handlePremove()
            queryClient.invalidateQueries({ queryKey: [`game ${id}`] })
        };

        socket.on('board_state_change', handleFenUpdate);
        socket.on('game_time_update', (res: GameAttributes) => {
            queryClient.invalidateQueries({ queryKey: [`game ${id}`] })
            console.log(res)
            setMe(
                {
                    ...me,
                    opponent: userData?.id === res?.player1.id ?
                        { ...res?.player2, timeLeft: res?.player2TimeLeft, lastOpponentMove: res?.player1LastMoveTime }
                        :
                        { ...res?.player1, timeLeft: res?.player1TimeLeft, lastOpponentMove: res?.player2LastMoveTime },
                    myInformation: userData?.id === res?.player1.id ?
                        { ...res?.player1, timeLeft: res?.player1TimeLeft, lastOpponentMove: res?.player2LastMoveTime }
                        :
                        { ...res?.player2, timeLeft: res?.player2TimeLeft, lastOpponentMove: res?.player1LastMoveTime },
                }
            )
            timeRef.current = userData.id === res.player1Id ? res.player1TimeLeft : res.player2TimeLeft
            opponentTimeRef.current = userData.id === res.player1Id ? res.player2TimeLeft : res.player1TimeLeft
            setMyDisplayTime(timeRef.current)
            setOpponentDisplayTime(opponentTimeRef.current)
        })


        return () => {
            socket.off('board_state_change', handleFenUpdate);
        };
    }, [data?.fen]);



    const formatSecondsToMMSS = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    }

    function positionToFen(position: Record<string, { pieceType: string }>): string {
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

    const promotionCheck = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        if (!targetSquare) return false
        if (!piece || piece.pieceType[1] !== 'P') return false;
        return me.color === 'w' ? targetSquare.match(/\d+$/)?.[0] === '8' : targetSquare.match(/\d+$/)?.[0] === '1'
    }

    const handlePromotionTurn = ({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string }) => {
        const possibleMoves = chessGame.moves({
            square: sourceSquare as Square,
            verbose: true
        });
        // check if target square is in possible moves (accounting for promotion notation)
        console.log(possibleMoves.some(move => move.to === targetSquare))
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
            socket.emit('board_state_change', {
                opponentId: me.opponent?.id,
                roomId: id,
                fen: chessGame.fen(),
            })
            console.log(timeRef.current, 'beforesaving')
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
        console.log(validMoves, foundMove)
        if (!foundMove) {
            ///If it is not in the valid moves, then it have 2 cases
            ///One is the player click on empty square, another is click on another piece
            ///We check it by get the move options of the square the player click
            const hasMoveOptions = getMoveOptions(square as Square)
            console.log(hasMoveOptions)
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
        console.log({ sourceSquare: currentPiece, targetSquare: square, piece: chosenPieceToDraggingPieceDataType })
        console.log(promotionCheck({ sourceSquare: currentPiece, targetSquare: square, piece: chosenPieceToDraggingPieceDataType }))
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
        console.log(chessGame.turn() !== me.color, 'Check')
        console.log(promotionMove)
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
        console.log(premove.targetSquare, premove.piece)
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
            alignItems: 'center'
        }}>
            <div className="w-full flex justify-between">
                <div className="flex gap-3">
                    <div className='w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div>
                        <div className="font-bold text-white">{me.opponent?.name}</div>
                        <div className="text-white opacity-50">{me.opponent?.elo}</div>
                    </div>
                </div>
                <div className="w-[100px] flex bg-white/80 justify-center items-center  text-xl font-bold ">
                    {opponentDisplayTime ? formatSecondsToMMSS(opponentDisplayTime) : '00:00'}
                </div>
            </div>

            <div style={{ position: 'relative' }}>
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
                    canDragPiece,
                    position,
                    onPieceDrop,
                    onSquareClick,
                    onSquareRightClick,
                    showAnimations,
                    squareStyles: { ...squareOptions, ...squareStyles },
                    id: 'play-vs-random',
                    boardStyle: { width: '700px' },
                    boardOrientation: me.color === 'w' ? 'white' : 'black',
                }} />
            </div>
            <div className="w-full flex justify-between">
                <div className="flex gap-3">
                    <div className='w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div>
                        <div className="font-bold text-white">{me.myInformation?.name}</div>
                        <div className="text-white opacity-50">{me.myInformation?.elo}</div>
                    </div>
                </div>
                <div className="w-[100px] flex bg-white/80 justify-center items-center  text-xl font-bold ">
                    {myDisplayTime ? formatSecondsToMMSS(myDisplayTime) : '00:00'}
                </div>
            </div>
        </div>
    )
}

export default ChessPvP