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
    rocketElo: number,
    blitzElo: number
}

export interface Player extends UserAttributes {
    lastOpponentMove: Date,
    timeLeft: number
}

export interface FriendShipAttributes {
    id: string,
    userId: string,
    friendId: string,
    user?: UserAttributes,
    friend?: UserAttributes
}

export interface Friend extends UserAttributes {
    friendship: FriendShipAttributes
}

export interface PaginationAttributes<T> {
    data: Array<T>,
    hasNextPage: boolean | undefined,
    hasPrevPage: boolean | undefined,
    nextCursor: string | undefined,
    prevCursor: string | undefined
}

export interface ProfileAttributes extends UserAttributes {
    friends: Array<Friend>,
    friendOf: Array<Friend>
    gameAsPlayer1: Array<GameAttributes>,
    gameAsPlayer2: Array<GameAttributes>
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
    gameType: GAME_TYPE,
    gameStatus?: GAME_STATUS
}

export interface GameMessagesAttributes {
    id?: string,
    gameId: string,
    senderId: string,
    content: string,
    createdAt?: string,
    updatedAt?: string,
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

export interface MessageAttributes {
    id?: string,
    chatBoxId: string,
    senderId: string,
    content: string,
    createdAt?: string,
    updatedAt?: string
}

export interface ChatBoxAttributes {
    id?: string,
    messages?: Array<MessageAttributes>
    user1Id: string,
    user2Id: string,
    user1?: UserAttributes,
    user2?: UserAttributes,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface PageParam {
    after: string | undefined,
    before: string | undefined
}
export enum GAME_TYPE {
    ROCKET = 'Rocket',
    BLITZ = 'Blitz',
    RAPID = 'Rapid',
}

export enum GAME_STATUS {
    FINISHED = 'finished',
    PLAYING = 'playing',
}