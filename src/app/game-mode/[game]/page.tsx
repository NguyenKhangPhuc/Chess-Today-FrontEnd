import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Link from 'next/link';
const GameModePage = () => {
    return (
        <div className='w-full scroll-smooth bg-black h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex flex-col items-center gap-10 text-white'>
                <div className="text-4xl font-bold">Game Modes Management</div>
                <div className="grid grid-cols-3 gap-5">
                    <Link href={`/game-mode/chess/play-with-ai`} className='w-full'>
                        <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                            <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                            <div className='font-bold text-xl'>Play with AI</div>
                            <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                        </div>
                    </Link>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-[#170f06] rounded-xl gap-5">
                        <SmartToyIcon sx={{ fontSize: 40, color: '#ad6717' }} />
                        <div className='font-bold text-xl'>Play with AI</div>
                        <div className='text-center'>Challenge and Learn from our AI agent. Quick and precise response</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameModePage