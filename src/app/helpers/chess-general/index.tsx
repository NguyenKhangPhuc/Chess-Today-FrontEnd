import { CurrentUserInGameAttributes } from "@/app/types/game";
import { Chess, PieceSymbol, Square } from "chess.js";
import { DraggingPieceDataType, PieceDropHandlerArgs, PositionDataType } from "react-chessboard";
// Helpers function for both Chess-PVP and chess-AI
// Shared function including promotionCheck, getValidMovesRegardlessOfTurn, handlePromotionTurn, positionToFen, getMoveOptions, handlePromotionInPremoves
interface promotionCheckProps {
    targetSquare: string | null,
    piece: DraggingPieceDataType
    me: CurrentUserInGameAttributes
}

interface getValidMovesRegardlessOfTurnProps {
    game: Chess,
    square: string,
    me: CurrentUserInGameAttributes
}

interface handlePromotionTurnProps {
    sourceSquare: string,
    targetSquare: string,
    chessGame: Chess,
    setPromotionMove: React.Dispatch<React.SetStateAction<Omit<PieceDropHandlerArgs, 'piece'> | null>>
}

interface getMoveOptionsProps {
    square: Square,
    chessGame: Chess,
    setSquareOptions: React.Dispatch<React.SetStateAction<object>>
}

interface handlePromotionInPremovesProps {
    piece: PieceSymbol,
    chessGame: Chess,
    promotionMove: Omit<PieceDropHandlerArgs, "piece"> | null,
    setPromotionMove: React.Dispatch<React.SetStateAction<Omit<PieceDropHandlerArgs, "piece"> | null>>
    premovesRef: React.RefObject<PieceDropHandlerArgs[]>
    setPremoves: React.Dispatch<React.SetStateAction<PieceDropHandlerArgs[]>>
    me: CurrentUserInGameAttributes
}

export const promotionCheck = ({ targetSquare, piece, me }: promotionCheckProps) => {
    ///Check for promotion, if there are no targetSquare, return false
    if (!targetSquare) return false
    ///If the chosen piece is not a Pawn, return false
    if (!piece || piece.pieceType[1] !== 'P') return false;
    ///Dependings on the color to check if the pawn need to go to row 8 or row 1 on the board.
    return me.color === 'w' ? targetSquare.match(/\d+$/)?.[0] === '8' : targetSquare.match(/\d+$/)?.[0] === '1'
}
export const getValidMovesRegardlessOfTurn = ({ game, square, me }: getValidMovesRegardlessOfTurnProps) => {
    const clone = new Chess(game.fen()); // clone current part

    if (clone.turn() !== me.color) {
        const fenParts = clone.fen().split(' ');
        fenParts[1] = me.color; // Change turn in fen
        clone.load(fenParts.join(' '));
    }

    return clone.moves({ square: square as Square, verbose: true });
}
export const handlePromotionTurn = ({ sourceSquare, targetSquare, chessGame, setPromotionMove }: handlePromotionTurnProps) => {
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
export const positionToFen = (position: PositionDataType) => {
    // From the position of the chessboard, create a clone chessboard,
    // Put the piece in the position to the chessboard and get its fen
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

export const getMoveOptions = ({ square, chessGame, setSquareOptions }: getMoveOptionsProps) => {
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

// Function to handle promotion in premoves
export const handlePromotionInPremoves = ({ piece, chessGame, promotionMove, setPromotionMove, setPremoves, premovesRef, me }: handlePromotionInPremovesProps) => {
    // Check the current turn and check if there exists the promotionMoves
    if (chessGame.turn() !== me.color && promotionMove) {
        // If exits map the promotion move to the needed type
        console.log(promotionMove)
        const pieceAsDraggingPiece = {
            isSparePiece: false,
            position: promotionMove.sourceSquare,
            pieceType: me.color + piece.toUpperCase(),
        }
        // Push the promotion move to the premoves
        console.log({ sourceSquare: promotionMove.sourceSquare, targetSquare: promotionMove.targetSquare, piece: pieceAsDraggingPiece })
        premovesRef.current.push({ sourceSquare: promotionMove.sourceSquare, targetSquare: promotionMove.targetSquare, piece: pieceAsDraggingPiece });
        setPremoves([...premovesRef.current]);
        // Set the promotion move to null
        setPromotionMove(null);
        return true;
    }
    return false;
}

