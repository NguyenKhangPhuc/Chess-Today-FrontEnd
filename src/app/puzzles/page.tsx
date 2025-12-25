'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Chessboard, PieceDropHandlerArgs, SquareHandlerArgs } from "react-chessboard"
import { getPuzzles } from "../services/puzzle"
import { PuzzleAttributes } from "../types/puzzles"
import Loader from "../Components/Loader"
import { useRef, useState } from "react"
import { Chess, Square } from "chess.js"
import { getMoveOptions } from "../helpers/chess-general"
import { PuzzleMoveAttributes } from "../types/puzzleMove"
import { createUserPuzzleRelation, getSpecificUserPuzzles } from "../services/userPuzzels"
import { useMe } from "../hooks/query-hooks/useMe"
import { UserPuzzleRelationAttribute } from "../types/usersPuzzles"
import GameSkeleton from "../Components/GameSkeleton"

const Home = () => {
    const queryClient = useQueryClient();
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;
    const validMoveIndexRef = useRef(0);
    const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleAttributes | undefined>()
    const [chessState, setChessState] = useState(chessGame.fen());
    const [currentPiece, setCurrentPiece] = useState('');
    const [boardSide, setBoardSide] = useState<'w' | 'b'>('w');
    const [squareOptions, setSquareOptions] = useState({})
    const [validMoves, setValidMoves] = useState<Array<PuzzleMoveAttributes> | undefined>()
    const { me, isLoading: isUserDataLoading } = useMe();
    const createPuzzleRelationMutation = useMutation({
        mutationKey: ['create_puzzle_user_relation'],
        mutationFn: createUserPuzzleRelation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user_puzzles'] });
        }

    })
    const { data: userPuzzles, isLoading: isLoadingUserPuzzles } = useQuery<Array<UserPuzzleRelationAttribute>>({
        queryKey: ['user_puzzles'],
        queryFn: getSpecificUserPuzzles
    });
    const { data: puzzles, isLoading: isLoadingPuzzles } = useQuery<Array<PuzzleAttributes>>({
        queryKey: ['puzzles'],
        queryFn: getPuzzles,
    })
    if (!puzzles || !userPuzzles || !me || isLoadingPuzzles || isLoadingUserPuzzles || isUserDataLoading) {
        return <GameSkeleton />
    }

    const handleGetDiffiultyLevel = (difficulty: number) => {
        switch (difficulty) {
            case 1:
                return 'Easy';
            case 2:
                return 'Medium';
            case 3:
                return 'Hard';
            default:
                return '';
        }
    }

    const handleCheckingStatus = (puzzleId: string) => {
        if (userPuzzles.find(relation => relation.puzzleId == puzzleId)) {
            return true;
        }
        return false
    }

    const extractBoardSide = (fen: string) => {
        const splittedFen = fen.split(' ');
        return splittedFen[1] as 'b' | 'w';
    }
    const handleSelectPuzzles = (puzzle: PuzzleAttributes) => {
        chessGame.load(puzzle.fen);
        setChessState(chessGame.fen());
        const puzzleBoardSide = extractBoardSide(puzzle.fen);
        setBoardSide(puzzleBoardSide)
        setValidMoves(puzzle.validMoves)
        setCurrentPuzzle(puzzle);
        validMoveIndexRef.current = 0;
        setSquareOptions({})
    }

    const handleIsValidMove = ({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string }) => {
        const newSquare: Record<string, React.CSSProperties> = {}
        if (validMoves![validMoveIndexRef.current].from == sourceSquare && validMoves![validMoveIndexRef.current].to == targetSquare) {
            if (validMoveIndexRef.current == validMoves!.length - 1) {
                newSquare[targetSquare] = {
                    background: 'rgba(255,255,0,0.5)',
                    animation: 'pulse 1s infinite alternate',
                };
                createPuzzleRelationMutation.mutate({ puzzleId: currentPuzzle!.id, userId: me!.id })
            } else {
                newSquare[targetSquare] = { background: 'hsla(141, 85%, 64%, 0.84)' }
                try {
                    validMoveIndexRef.current += 1;
                    setTimeout(() => {
                        chessGame.move(validMoves![validMoveIndexRef.current].san)
                        validMoveIndexRef.current += 1;
                        setChessState(chessGame.fen())
                        setCurrentPiece('')
                    }, 500)
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            newSquare[targetSquare] = { background: 'hsla(0, 89%, 67%, 0.84)' }
            setTimeout(() => {
                chessGame.load(currentPuzzle!.fen);
                setChessState(chessGame.fen());
                setCurrentPiece('')
                setSquareOptions({})
                validMoveIndexRef.current = 0;
            }, 500)
        }
        setSquareOptions(newSquare)
    }

    const onPieceDrop = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        if (!targetSquare || sourceSquare == targetSquare) {
            return false;
        }

        try {
            chessGame.move({
                from: sourceSquare!,
                to: targetSquare,
                promotion: 'q'
            })
            setChessState(chessGame.fen());
            setCurrentPiece('')
            setSquareOptions({})
            handleIsValidMove({ sourceSquare: sourceSquare as string, targetSquare: targetSquare as string });
            return true
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
        if (!currentPiece && !piece) {
            return false;
        }
        if (!currentPiece && piece) {
            if (piece?.pieceType[0] && piece?.pieceType[0] !== boardSide) {
                return false
            }
            const moveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            setCurrentPiece(moveOptions ? square : '');
            return false;
        }

        const validMoves = chessGame.moves({ square: currentPiece as Square, verbose: true })

        const foundMove = validMoves.find(m => m.to === square)
        if (!foundMove) {
            const moveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            if (moveOptions) {
                setCurrentPiece(square)
            } else {
                setCurrentPiece('')
                setSquareOptions({})
            }
            return
        }
        try {
            chessGame.move({
                from: currentPiece!,
                to: square as Square,
                promotion: 'q'
            })
            setChessState(chessGame.fen());
            setCurrentPiece('')
            setSquareOptions({})
            handleIsValidMove({ sourceSquare: currentPiece, targetSquare: square })
            return true
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    console.log(chessGame.history({ verbose: true }))
    console.log(puzzles)

    return (
        <div className="w-full min-h-screen flex xl:flex-row flex-col items-center justify-center bg-[#1a1917]">
            <div className="lg:h-[800px] md:h-[600px] flex flex-col items-center justify-center" >
                <div className="xl:w-[720px] xl:h-[720px] md:w-[600px] md:h-[600px] ">
                    <Chessboard options={{
                        id: 'puzzle',
                        onPieceDrop,
                        onSquareClick,
                        boardStyle: { width: '100%', height: '100%' },
                        position: chessState,
                        boardOrientation: boardSide == 'w' ? 'white' : 'black',
                        squareStyles: squareOptions,
                    }} />
                </div>
            </div>
            <div className="xl:w-2/5 w-full h-[720px] flex flex-col rounded-2xl shadow-xl bg-[#1f1e1b] border border-[#2c2b29] overflow-hidden text-white">
                <div className="flex text-sm font-semibold uppercase tracking-wider border-b border-[#3a3937]">
                    <div className="w-1/2 text-center p-4 bg-[#302e2b] border-r border-[#3a3937] cursor-pointer hover:bg-[#3a3835] transition">
                        Puzzles
                    </div>
                    <div className="w-1/2 text-center p-4 bg-[#1f1e1b] cursor-pointer hover:bg-[#2a2926] transition">
                        LeaderBoard
                    </div>
                </div>
                <div className="w-full max-h-full overflow-y-auto flex flex-col p-5 gap-2">
                    <div className="w-full grid grid-cols-4 gap-3 pb-5">
                        <div className="w-full flex justify-center items-center font-semibold ">Number</div>
                        <div className="w-full flex justify-center items-center font-semibold ">Title</div>
                        <div className="w-full flex justify-center items-center font-semibold ">Level</div>
                        <div className="w-full flex justify-center items-center font-semibold ">Status</div>
                    </div>
                    {puzzles.map((puzzle, index) => {
                        return (
                            <div key={`puzzle ${puzzle.id}`} className={`w-full grid grid-cols-4 gap-3 p-1 cursor-pointer hover:opacity-50 ${index % 2 == 0 ? 'bg-[#2a2926]/80' : ''}`} onClick={() => handleSelectPuzzles(puzzle)}>
                                <div className="w-full flex justify-center items-center font-semibold ">{index + 1}.</div>
                                <div className="w-full flex justify-center items-center font-semibold ">{puzzle.title}</div>
                                <div className="w-full flex justify-center items-center font-semibold ">{handleGetDiffiultyLevel(puzzle.difficulty)}</div>
                                <div className="w-full flex justify-center items-center font-semibold ">{handleCheckingStatus(puzzle.id) ? 'solved' : 'unsolved'}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home