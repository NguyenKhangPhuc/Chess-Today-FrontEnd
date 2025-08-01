'use client'
import Diversity1Icon from '@mui/icons-material/Diversity1';
import LinkIcon from '@mui/icons-material/Link';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
const Home = () => {
    return (
        <div className='w-full scroll-smooth min-h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex gap-10 text-white'>
                <div className='w-2/3 flex flex-col gap-10'>
                    <div className="flex gap-5 font-bold items-center">
                        <Diversity1Icon sx={{ fontSize: 40 }} />
                        <div className='text-3xl'>Friends</div>
                    </div>
                    <div className='w-full grid grid-cols-2 gap-2 font-bold text-xl'>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'>
                            <LinkIcon sx={{ fontSize: 30 }} />
                            <div>My Connections</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'>
                            <LinkIcon sx={{ fontSize: 30 }} />
                            <div>People</div>
                            <div className='absolute right-5'>
                                <Diversity2Icon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'>
                            <LinkIcon sx={{ fontSize: 30 }} />
                            <div>Sent Invitation </div>
                            <div className='absolute right-5'>
                                <SendIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'>
                            <LinkIcon sx={{ fontSize: 30 }} />
                            <div>My Connections</div>
                            <div className='absolute right-5'>
                                <EmailIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home