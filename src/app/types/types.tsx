export interface LoginAttributes {
    username: string,
    password: string,
}

export interface SignUpAttributes extends LoginAttributes {
    name: string,
}

export interface Invitations {
    id: string,
    createdAt?: Date,
    receiverId: string,
    senderId: string,
    status?: string,
    updatedAt?: string
    receiver?: UserAttributes,
    sender?: UserAttributes
}

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
}

export interface Player extends UserAttributes {
    lastOpponentMove: Date,
    timeLeft: number
}

export interface ProfileAttributes extends UserAttributes {
    friends: Array<UserAttributes>,
    friendOf: Array<UserAttributes>

}

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
}

export interface GameMessagesAttributes {
    id?: string,
    gameId: string,
    senderId: string,
    content: string,
    createdAt?: string,
    updatedAt?: string
}

export interface MoveAttributes {
    id?: string;
    gameId: string;
    before: string;
    after: string;
    color: string;
    piece: string;
    from: string;
    to: string;
    san: string;
    lan: string;
    moverId: string;
    mover?: UserAttributes
}