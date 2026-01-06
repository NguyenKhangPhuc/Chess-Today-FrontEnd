import { Person2 } from '@mui/icons-material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import { Player } from '../types/user';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GppBadIcon from '@mui/icons-material/GppBad';
import CloseIcon from '@mui/icons-material/Close';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
// Win/Lose result of the chess game
const SpecificResult = ({ me, isWinner, elo, setIsCheckmate, setIsGameOver }:
    {
        me: { color: string, myInformation: Player, opponent: Player },
        isWinner: boolean,
        elo: { userElo: number | undefined, opponentElo: number | undefined }
        setIsCheckmate: React.Dispatch<React.SetStateAction<boolean>>,
        setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>
    }) => {
    const onClose = () => {
        setIsCheckmate(false)
        setIsGameOver(false)
    }
    const { userElo, opponentElo } = elo
    return (
        <div className="flex flex-col absolute lg:max-w-3/5 lg:max-h-4/5 sm:max-w-2/3 sm:max-h-4/5 w-7/8 max-h-11/12 general-backgroundcolor p-5 text-white gap-2 rounded-xl ">
            <div
                className="absolute top-3 right-3 cursor-pointer hover:opacity-70"
                onClick={onClose}
            >
                <CloseIcon />
            </div>
            <div className="w-full sm:p-5 p-2 flex items-center justify-center bg-[#302e2b] font-bold text-white sm:text-2xl text-base">
                {isWinner ? 'You win' : 'You lost'}
            </div>
            <div className="w-full flex justify-center items-center gap-1 text-white p-2">
                <div className='sm:w-1/2 w-2/5 flex flex-col items-center gap-2'>
                    <div className="sm:w-16 sm:h-16 w-12 h-12 p-5 bg-gray-300 rounded-lg flex items-center justify-center relative">
                        {isWinner &&
                            <svg className="logoIcon absolute -top-6 " height="25px" fill='yellow' viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"></path></svg>
                        }
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div className='font-bold sm:text-base text-sm text-center'>{me.myInformation.name}</div>
                    <div className="text-sm opacity-50">{userElo}</div>
                </div>
                {isWinner ? <EmojiEventsIcon sx={{ fontSize: 30 }} /> : <GppBadIcon sx={{ fontSize: 30 }} />}
                <div className='sm:w-1/2 w-2/5 flex flex-col items-center gap-2'>
                    <div className='sm:w-16 sm:h-16 w-12 h-12 p-5 bg-gray-300 rounded-lg flex items-center justify-center relative'>
                        {!isWinner &&
                            <svg className="logoIcon absolute -top-6 " height="25px" fill='yellow' viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"></path></svg>
                        }
                        <Person2 sx={{ color: 'black' }} />
                    </div>
                    <div className='font-bold sm:text-base text-sm text-center'>{me.opponent.name}</div>
                    <div className="text-sm opacity-50">{opponentElo}</div>
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

export default SpecificResult