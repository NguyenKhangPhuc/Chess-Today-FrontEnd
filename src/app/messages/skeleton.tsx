import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SmsIcon from '@mui/icons-material/Sms';
import { Person2 } from '@mui/icons-material';
const MessagesSkeleton = () => {
    return (
        <div className="w-full h-screen text-white">
            <div className="flex gap-3 max-w-7xl h-full md:p-5 mx-auto flex">
                <div className={`md:flex flex-col md:w-1/3 w-full h-full general-backgroundcolor`}>
                    <div className="w-full p-2 flex flex-col bg-[#454441]/50 items-center justify-center">
                        <ForwardToInboxIcon />
                        <div className='text-sm font-bold'>Inbox</div>
                    </div>
                    <div className="flex gap-2 w-full p-2 cursor-pointer" >
                        <div className="w-[24px] h-[24px] skeleton2-bg"></div>
                        <div className="w-[150px] h-[24px] skeleton2-bg"></div>
                    </div>

                    <div className='w-full flex flex-col border-t border-gray-700 p-2 gap-3'>
                        <div className={`w-full flex gap-2 cursor-pointer hover:opacity-70 `} >
                            <div className='flex justify-center items-center w-10 h-10 p-5 bg-gray-300 rounded-lg '>
                                <Person2 sx={{ color: 'black' }} />
                            </div>
                            <div className='w-full flex flex-col gap-1'>
                                <div className='flex justify-between font-bold'>
                                    <div className="w-[150px] h-[20px] skeleton2-bg"></div>
                                    <div className='text-sm opacity-50'>
                                        <div className="w-[50px] h-[20px] skeleton2-bg"></div>
                                    </div>
                                </div>
                                <div className="w-[100px] h-[20px] skeleton2-bg"></div>
                            </div>
                        </div>
                        <div className={`w-full flex gap-2 cursor-pointer hover:opacity-70 `} >
                            <div className='flex justify-center items-center w-10 h-10 p-5 bg-gray-300 rounded-lg '>
                                <Person2 sx={{ color: 'black' }} />
                            </div>
                            <div className='w-full flex flex-col gap-1'>
                                <div className='flex justify-between font-bold'>
                                    <div className="w-[150px] h-[20px] skeleton2-bg"></div>
                                    <div className='text-sm opacity-50'>
                                        <div className="w-[50px] h-[20px] skeleton2-bg"></div>
                                    </div>
                                </div>
                                <div className="w-[100px] h-[20px] skeleton2-bg"></div>
                            </div>
                        </div>
                        <div className={`w-full flex gap-2 cursor-pointer hover:opacity-70 `} >
                            <div className='flex justify-center items-center w-10 h-10 p-5 bg-gray-300 rounded-lg '>
                                <Person2 sx={{ color: 'black' }} />
                            </div>
                            <div className='w-full flex flex-col gap-1'>
                                <div className='flex justify-between font-bold'>
                                    <div className="w-[150px] h-[20px] skeleton2-bg"></div>
                                    <div className='text-sm opacity-50'>
                                        <div className="w-[50px] h-[20px] skeleton2-bg"></div>
                                    </div>
                                </div>
                                <div className="w-[100px] h-[20px] skeleton2-bg"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:flex hidden w-2/3 h-full flex flex-col justify-center items-center general-backgroundcolor">
                    <SmsIcon sx={{ fontSize: 60 }} />
                    <div className='font-bold text-2xl'>Choose/Create the ChatBox</div>
                </div>

            </div>
        </div>
    )
}

export default MessagesSkeleton