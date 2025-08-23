import { UserAttributes } from "./user"

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