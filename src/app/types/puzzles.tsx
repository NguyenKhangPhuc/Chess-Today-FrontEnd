import { PuzzleMoveAttributes } from "./puzzleMove";

export enum PUZZLE_LEVEL {
    EASY = 1,
    MEDIUM = 2,
    HARD = 3,
}

export interface PuzzleAttributes {
    id: string,
    fen: string,
    title: string,
    difficulty: PUZZLE_LEVEL,
    validMoves: Array<PuzzleMoveAttributes>
    createdAt?: string,
    updatedAt?: string,
}
