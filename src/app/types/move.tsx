import { UserAttributes } from "./user";

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
