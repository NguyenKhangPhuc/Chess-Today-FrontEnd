import { Person2 } from "@mui/icons-material"
import { Chess, WHITE } from "chess.js"
import { CurrentUserInGameAttributes } from "../types/game"
interface PlayerBarProps {
    name: string,
    elo: number | undefined,
    isMyTurn?: boolean,
    time: string,
}
export const PlayerBar = ({ name, elo, isMyTurn, time }: PlayerBarProps) => {
    return (
        <div
            className={`w-full flex items-center justify-between p-3 rounded-xl border bg-[#1f1e1b]/90 shadow-sm ${isMyTurn ? "border-[#6e3410]/80" : "border-[#3a3937]"
                } transition-all duration-300`}
        >

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#302e2b] rounded-xl border border-[#454441] shadow-inner">
                    <Person2 sx={{ color: 'white', fontSize: 20 }} />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="font-bold text-white text-[15px] truncate max-w-[120px]">
                        {name}
                    </span>
                    <span className="text-sm text-gray-400">{elo}</span>
                </div>
            </div>

            {/* Clock */}
            <div
                className={`w-[110px] text-center py-1 rounded-lg font-semibold text-lg tracking-wider ${isMyTurn
                    ? "bg-[#6e3410]/80 text-white shadow-md"
                    : "bg-white opacity-50 text-black"
                    } transition-colors duration-300`}
            >
                {time}
            </div>
        </div>
    )
}