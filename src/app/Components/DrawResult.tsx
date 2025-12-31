import { Person2 } from '@mui/icons-material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BalanceIcon from '@mui/icons-material/Balance';
import AddIcon from '@mui/icons-material/Add';
import { Player } from '../types/user';
import CloseIcon from '@mui/icons-material/Close';

// UI of the draw result when the game is draw
const DrawResult = ({ me, elo, setIsDraw, setIsGameOver }: {
    me: { color: string, myInformation: Player, opponent: Player },
    elo: { userElo: number | undefined, opponentElo: number | undefined }
    setIsDraw: React.Dispatch<React.SetStateAction<boolean>>,
    setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { userElo, opponentElo } = elo
    const onClose = () => {
        setIsDraw(false)
        setIsGameOver(false)
    }
    return (
        <div className="flex flex-col absolute lg:w-1/2 lg:h-3/5 sm:w-2/3 sm:h-4/5 w-7/8 h-11/12 general-backgroundcolor p-5 text-white gap-2 rounded xl">
            <div
                className="absolute top-3 right-3 cursor-pointer hover:opacity-70"
                onClick={onClose}
            >
                <CloseIcon />
            </div>
            <div className="w-full sm:p-5 p-2 flex items-center justify-center bg-[#302e2b] font-bold text-white sm:text-2xl text-base">
                Draw
            </div>
            <div className="w-full flex justify-center items-center gap-1 text-white p-2">
                <div className='sm:w-1/2 w-2/5 flex flex-col items-center gap-2'>
                    <div className='sm:w-16 sm:h-16 w-12 h-12 p-5 bg-gray-300 rounded-lg flex items-center justify-center'>
                        <Person2 sx={{ color: 'black' }} />

                    </div>
                    <div className='font-bold'>{me.myInformation.name}</div>
                    <div className="text-sm opacity-50">{userElo} + 0</div>
                </div>
                <BalanceIcon sx={{ fontSize: 30, color: 'white' }} />
                <div className='sm:w-1/2 w-2/5 flex flex-col items-center gap-2'>
                    <div className='sm:w-16 sm:h-16 w-12 h-12 p-5 bg-gray-300 rounded-lg flex items-center justify-center'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div className='font-bold'>{me.opponent.name}</div>
                    <div className="text-sm opacity-50">{opponentElo} + 0</div>
                </div>
            </div>
            <div className='cursor-pointer w-full sm:p-2 p-1 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <RestartAltIcon sx={{ fontSize: 30 }} />
                <div className='font-bold sm:text-lg text-sm'>Play Again</div>
            </div>
            <div className='cursor-pointer w-full sm:p-2 p-1 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <AddIcon sx={{ fontSize: 30 }} />
                <div className='font-bold sm:text-lg text-sm'>New Game</div>
            </div>
        </div>
    )
}

export default DrawResult