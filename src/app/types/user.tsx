import { Friend } from "./friend"
import { GameAttributes } from "./game"
import { Invitations } from "./invitation"

export interface UserAttributes {
    id: string,
    name: string,
    onlineAt: Date,
    status: boolean,
    createdAt: Date,
    updatedAt: Date,
    username: string,
    elo: number,
    receivedInvitations: Array<Invitations>,
    sentInvitations: Array<Invitations>
    rocketElo: number,
    blitzElo: number
}

export interface Player extends UserAttributes {
    lastOpponentMove: Date,
    timeLeft: number
}
export interface ProfileAttributes extends UserAttributes {
    friends: Array<Friend>,
    friendOf: Array<Friend>
    gameAsPlayer1: Array<GameAttributes>,
    gameAsPlayer2: Array<GameAttributes>
}

export interface UserBasicAttributes {
    id: string,
    username: string,
    name: string,
}
