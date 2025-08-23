import { MessageAttributes } from "./message"
import { UserAttributes } from "./user"

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