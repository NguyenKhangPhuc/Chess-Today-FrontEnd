export enum PUZZLE_STATUS {
    SOLVED = 'solved',
    UNSOLVED = 'unsolved',
}
export interface UserPuzzleRelationAttribute {
    id?: string,
    userId: string,
    puzzleId: string,
    attempt: number,
    status: PUZZLE_STATUS,
    createdAt?: string,
    updatedAt?: string
}