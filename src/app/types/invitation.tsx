import { INVITATION_STATUS } from "./enum"
import { UserAttributes } from "./user"

export interface Invitations {
    id: string,
    createdAt?: Date,
    receiverId: string,
    senderId: string,
    status?: INVITATION_STATUS,
    updatedAt?: string
    receiver?: UserAttributes,
    sender?: UserAttributes
}