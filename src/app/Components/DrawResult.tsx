import { Person2 } from '@mui/icons-material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BalanceIcon from '@mui/icons-material/Balance';
import AddIcon from '@mui/icons-material/Add';
import { Player } from '../types/user';
const DrawResult = ({ me, elo }: { me: { color: string, myInformation: Player, opponent: Player }, elo: { userElo: number | undefined, opponentElo: number | undefined } }) => {
    const { userElo, opponentElo } = elo

    return (
        <div className="flex flex-col absolute w-1/2 h-1/2 general-backgroundcolor p-5 text-white gap-2 rounded xl">
            <div className="w-full p-5 flex items-center justify-center bg-[#302e2b] font-bold text-white text-2xl">
                Draw
            </div>
            <div className="w-full flex justify-center items-center gap-1 text-white p-2">
                <div className='w-1/2 flex flex-col items-center gap-2'>
                    <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />

                    </div>
                    <div className='font-bold'>{me.myInformation.name}</div>
                    <div className="text-sm opacity-50">{userElo} + 0</div>
                </div>
                <BalanceIcon sx={{ fontSize: 30, color: 'white' }} />
                <div className='w-1/2 flex flex-col items-center gap-2'>
                    <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div className='font-bold'>{me.opponent.name}</div>
                    <div className="text-sm opacity-50">{opponentElo} + 0</div>
                </div>
            </div>
            <div className='cursor-pointer w-full p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <RestartAltIcon sx={{ fontSize: 30 }} />
                <div className='font-bold text-lg'>Play Again</div>
            </div>
            <div className='cursor-pointer w-full p-2 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                <AddIcon sx={{ fontSize: 30 }} />
                <div className='font-bold text-lg'>New Game</div>
            </div>
        </div>
    )
}

export default DrawResult