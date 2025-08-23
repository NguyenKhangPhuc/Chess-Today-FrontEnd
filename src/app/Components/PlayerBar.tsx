import { Person2 } from "@mui/icons-material"
import { Chess } from "chess.js"
import { CurrentUserInGameAttributes } from "../types/game"
interface PlayerBarProps {
    name: string,
    elo: number | undefined,
    isMyTurn?: boolean,
    time: string,
}
export const PlayerBar = ({ name, elo, isMyTurn, time }: PlayerBarProps) => {
    return (
        <div className="w-full flex justify-between">
            <div className="flex gap-3">
                <div className='w-12 h-12 flex items-center justify-center bg-gray-300 rounded-lg'>
                    <Person2 sx={{ color: 'black' }} />
                </div>
                <div>
                    <div className="font-bold text-white">{name}</div>
                    <div className="text-white opacity-50">{elo}</div>
                </div>
            </div>
            <div className={`w-[100px] flex bg-white/80 justify-center items-center  text-xl font-bold ${!isMyTurn && 'opacity-50'}`}>
                {time}
            </div>
        </div>
    )
}