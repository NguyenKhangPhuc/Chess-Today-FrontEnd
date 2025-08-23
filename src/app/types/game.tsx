import { GAME_STATUS, GAME_TYPE } from "./enum"
import { Player, UserAttributes } from "./user"

export interface GameAttributes {
    id: string,
    createdAt: Date,
    fen: string,
    moveHistory: [],
    player1: UserAttributes,
    player2: UserAttributes,
    player1Id: string,
    player2Id: string
    player1LastMoveTime: Date,
    player2LastMoveTime: Date,
    player1TimeLeft: number,
    player2TimeLeft: number,
    updatedAt: Date,
    winnerId: string,
    gameType: GAME_TYPE,
    gameStatus?: GAME_STATUS
}

export interface CurrentUserInGameAttributes {
    color: string,
    opponent: Player,
    myInformation: Player
}