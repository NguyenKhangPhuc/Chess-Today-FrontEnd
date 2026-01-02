'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Chessboard, chessColumnToColumnIndex, defaultPieces, DraggingPieceDataType, PieceDropHandlerArgs, PieceRenderObject, SquareHandlerArgs } from "react-chessboard"
import { getPuzzles } from "../services/puzzle"
import { PuzzleAttributes } from "../types/puzzles"
import { useRef, useState } from "react"
import { Chess, PieceSymbol, Square } from "chess.js"
import { getMoveOptions, handlePromotionTurn, promotionCheck } from "../helpers/chess-general"
import { PuzzleMoveAttributes } from "../types/puzzleMove"
import { createUserPuzzleRelation, getSpecificUserPuzzles } from "../services/userPuzzels"
import { UserPuzzleRelationAttribute } from "../types/usersPuzzles"
import GameSkeleton from "../Components/GameSkeleton"
import { useGetAuthentication } from "../hooks/query-hooks/useGetAuthentication"

const Home = () => {
    // Query client to invalidate the query
    const queryClient = useQueryClient();
    // Manage the current chess state
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;
    // Valid move index to control and check the user move
    const validMoveIndexRef = useRef(0);
    // State to manage current chosen puzzles 
    const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleAttributes | undefined>()
    // State to manage the chessboard UI
    const [chessState, setChessState] = useState(chessGame.fen());
    // Current chosen piece on the board
    const [currentPiece, setCurrentPiece] = useState('');
    // State to manage if there exists promotion move
    const [promotionMove, setPromotionMove] = useState<Omit<PieceDropHandlerArgs, 'piece'> | null>(null);
    // State to manage the board side: black or white
    const [boardSide, setBoardSide] = useState<'w' | 'b'>('w');
    // The current piece move options
    const [squareOptions, setSquareOptions] = useState({})
    // State to manage the array of valid moves
    const [validMoves, setValidMoves] = useState<Array<PuzzleMoveAttributes> | undefined>()
    // Get the user basic information
    const { authenticationInfo, isLoading: isUserDataLoading } = useGetAuthentication();
    // Mutation to create the puzzle - user relation (meaning that the user solved it)
    const createPuzzleRelationMutation = useMutation({
        mutationKey: ['create_puzzle_user_relation'],
        mutationFn: createUserPuzzleRelation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user_puzzles'] });
        }

    })
    // Get the user-puzzles relations (Which puzzles that the user solved already)
    const { data: userPuzzles, isLoading: isLoadingUserPuzzles } = useQuery<Array<UserPuzzleRelationAttribute>>({
        queryKey: ['user_puzzles'],
        queryFn: getSpecificUserPuzzles
    });
    // Get all the puzzles
    const { data: puzzles, isLoading: isLoadingPuzzles } = useQuery<Array<PuzzleAttributes>>({
        queryKey: ['puzzles'],
        queryFn: getPuzzles,
    })
    if (!puzzles || !userPuzzles || !authenticationInfo || isLoadingPuzzles || isLoadingUserPuzzles || isUserDataLoading) {
        return <GameSkeleton />
    }

    const { userInfo: me } = authenticationInfo


    // Function to get the difficulty level
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
    // Function to check the user-puzzles relation
    const handleCheckingStatus = (puzzleId: string) => {
        // Find if the puzzle is already solved
        if (userPuzzles.find(relation => relation.puzzleId == puzzleId)) {
            return true;
        }
        return false
    }

    // Get the board side of the puzzle
    const extractBoardSide = (fen: string | undefined) => {
        if (fen == undefined) return;
        const splittedFen = fen.split(' ');
        return splittedFen[1] as 'b' | 'w';
    }

    const squareWidth = typeof window !== 'undefined' ? window.document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect()?.width ?? 0 : 0;
    const promotionSquareLeft = promotionMove?.targetSquare ? squareWidth * chessColumnToColumnIndex(promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? '', 8,
        // number of columns
        extractBoardSide(currentPuzzle?.fen) === 'w' ? 'white' : 'black' // board orientation
    ) : 0;
    // Function to handle select the puzzle
    const handleSelectPuzzles = (puzzle: PuzzleAttributes) => {
        // Load the new puzzle's fen
        chessGame.load(puzzle.fen);
        // Update the chessboard UI
        setChessState(chessGame.fen());
        // Get the puzzle board side
        const puzzleBoardSide = extractBoardSide(puzzle.fen)!;
        // Update the board side
        setBoardSide(puzzleBoardSide)
        // Set the valid moves to become the chosen puzzle's valid moves
        setValidMoves(puzzle.validMoves)
        // Set the current puzzle to be this puzzles
        setCurrentPuzzle(puzzle);
        // Set the current valid move index = 0
        validMoveIndexRef.current = 0;
        // Set square options empty to remove previous chosen piece
        setSquareOptions({})
        // Clear the promotionMove
        setPromotionMove(null);
    }

    // Function to check if the user's move is the valid move
    const handleIsValidMove = ({ sourceSquare, targetSquare, piece }: { sourceSquare: string, targetSquare: string, piece: string }) => {
        // Map to update the user square UI <square, css properties>
        const newSquare: Record<string, React.CSSProperties> = {}
        // Check if the move the user made match with the current move in the valid moves array
        if (
            validMoves![validMoveIndexRef.current].from == sourceSquare &&
            validMoves![validMoveIndexRef.current].to == targetSquare &&
            piece == validMoves![validMoveIndexRef.current].piece) {
            // If the current valid moveIndex is the last move in the valid moves array
            if (validMoveIndexRef.current == validMoves!.length - 1) {
                // Update the target square color and its animation announcing that the user solved it
                newSquare[targetSquare] = {
                    background: 'rgba(255,255,0,0.5)',
                    animation: 'pulse 1s infinite alternate',
                };
                // Create the user-puzzle relation to announce that the user solve it
                createPuzzleRelationMutation.mutate({ puzzleId: currentPuzzle!.id, userId: me!.id })
            } else {
                // If it is not the last move, but it is still correct
                newSquare[targetSquare] = { background: 'hsla(141, 85%, 64%, 0.84)' }
                try {
                    // Increase the currentMove index by 1
                    validMoveIndexRef.current += 1;
                    // Set a timeout in 500ms that the browser will automatically make a next move (opponent move)
                    setTimeout(() => {
                        // Make the opponent move
                        chessGame.move(validMoves![validMoveIndexRef.current].san)
                        // Increase the currentMove index by 1
                        validMoveIndexRef.current += 1;
                        // Update the chessboard UI
                        setChessState(chessGame.fen())
                        // Empty the currentPiece
                        setCurrentPiece('')
                    }, 500)
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            // If it is not a vlid move -> set the target square to be red color
            newSquare[targetSquare] = { background: 'hsla(0, 89%, 67%, 0.84)' }
            // Set a timeout in 500ms that we will reset the board
            setTimeout(() => {
                // Reset the chessboard by loading the puzzle initial fen
                chessGame.load(currentPuzzle!.fen);
                // Update the chessboard UI
                setChessState(chessGame.fen());
                // Reset the current piece and square options
                setCurrentPiece('')
                setSquareOptions({})
                validMoveIndexRef.current = 0;
            }, 500)
        }
        // Update the square UI
        setSquareOptions(newSquare)
    }

    // Function to handle when a user drop a piece
    const onPieceDrop = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        // Check if it is a valid move with a sourceSquare and the target square != source square
        if (!targetSquare || sourceSquare == targetSquare) {
            return false;
        }

        if (promotionCheck({ targetSquare, piece, me: validMoves![validMoveIndexRef.current] })) {

            // If it is not a premove and it is a promotion move, then handle promotion normally
            // get all possible moves for the source square
            handlePromotionTurn({ sourceSquare, targetSquare, chessGame, setPromotionMove })

            // return true so that the promotion move is not animated
            // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
            return true;

        }
        // Try to make a move and catch the error if exists
        return handleMove({ sourceSquare, targetSquare, piece })
    }

    // Function to handle when a user click on the piece, show its move options
    const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
        // Check if there exists the currentPiece and the chosen piece
        if (!currentPiece && !piece) {
            return false;
        }
        // If there are not current piece and there exist the chosen piece (User click on a new piece)
        if (!currentPiece && piece) {
            // Check the pieceType to see if it match the boardSide
            if (piece?.pieceType[0] && piece?.pieceType[0] !== boardSide) {
                return false
            }
            // If it match -> get the move options of the chosen piece
            const moveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            // If there exists a move options -> set the currentPiece to the chosen piece square
            setCurrentPiece(moveOptions ? square : '');
            return false;
        }

        // If the user has picked a piece before and now click on the squares
        // We get all the valid moves of the picked currentPiece
        const foundValidMoves = chessGame.moves({ square: currentPiece as Square, verbose: true })
        // We found if the empty square that the user picked is one of these valid moves
        const foundMove = foundValidMoves.find(m => m.to === square)
        if (!foundMove) {
            // If it is not -> get move options of the square
            const moveOptions = getMoveOptions({ square: square as Square, chessGame, setSquareOptions })
            if (moveOptions) {
                // If exists the moveOptions -> set the current piece to the newSquare
                setCurrentPiece(square)
            } else {
                // If it is not -> empty the currentPiece and the squares UI
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
        if (promotionCheck({ targetSquare: square, piece: chosenPieceToDraggingPieceDataType, me: validMoves![validMoveIndexRef.current] })) {
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

    const handleMove = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
        // Function to handle move
        try {
            chessGame.move({
                from: sourceSquare!,
                to: targetSquare as Square,
                promotion: piece.pieceType[1].toLowerCase()
            })
            // Update the UI, empty the currentPiece, squares UI, and check if it is a valid move
            setChessState(chessGame.fen());
            setCurrentPiece('')
            setSquareOptions({})
            setPromotionMove(null)
            handleIsValidMove({ sourceSquare: sourceSquare, targetSquare: targetSquare as Square, piece: piece.pieceType[1].toLowerCase() })
            return true
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    function onPromotionPieceSelect(piece: PieceSymbol) {
        // Function to handle promotion move in premoves
        // Create the object to be able to make a move
        const chosenPiece = chessGame.get(promotionMove?.sourceSquare as Square)!
        const chosenPieceToDraggingPieceDataType = {
            isSparePiece: false,
            pieceType: chosenPiece?.color + piece,
            position: promotionMove?.sourceSquare,
        } as DraggingPieceDataType
        return handleMove({ sourceSquare: promotionMove!.sourceSquare, targetSquare: promotionMove!.targetSquare, piece: chosenPieceToDraggingPieceDataType })
    }
    console.log(chessGame.history({ verbose: true }))
    console.log(puzzles)

    return (
        <div className="w-full min-h-screen flex xl:flex-row flex-col items-center justify-center bg-[#1a1917]">
            <div className="lg:h-[800px] md:h-[600px] flex flex-col items-center justify-center" >
                <div className="xl:w-[720px] xl:h-[720px] md:w-[600px] md:h-[600px] ">
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