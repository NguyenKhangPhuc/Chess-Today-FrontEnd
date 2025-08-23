import { UserAttributes } from "./user"

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