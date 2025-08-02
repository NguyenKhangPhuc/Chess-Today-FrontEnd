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
    receivedInvitations: Array<Invitations>,
    sentInvitations: Array<Invitations>
}

export interface ProfileAttributes extends UserAttributes {
    friends: Array<UserAttributes>,
    friendOf: Array<UserAttributes>

}