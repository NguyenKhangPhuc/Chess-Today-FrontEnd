'use client'
import { Person2 } from "@mui/icons-material"
import RocketIcon from '@mui/icons-material/Rocket';
import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';


const ProfileSkeleton = () => {
    return (
        <div className='w-full scroll-smooth min-h-screen'>

            <div className='max-w-7xl mx-auto py-10 flex flex-col gap-10 text-white'>
                <div className="w-full flex flex-col general-backgroundcolor ">
                    <div className="w-full flex sm:flex-row flex-col gap-5 border-b border-gray-500 p-5 ">
                        <div className='sm:w-45 sm:h-45 w-full h-full p-5 bg-gray-200 rounded-lg flex items-center justify-center'>
                            <Person2 sx={{ color: 'black', fontSize: 80 }} />
                        </div>
                        <div className="sm:w-auto w-full flex-1 flex flex-col justify-between sm:items-start items-center">
                            <div className="sm:w-auto w-full flex flex-col gap-2 ">
                                <div className="w-[150px] h-[40px] skeleton2-bg"></div>
                                <div className="w-full flex gap-5">
                                    <div className="w-[150px] h-[30px] skeleton2-bg"></div>
                                    <div className="w-[100px] h-[30px] skeleton2-bg"></div>
                                </div>
                            </div>
                            <div className='cursor-pointer sm:w-[200px] w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <div className='font-bold text-base'>Update Profile</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex gap-2 items-center">
                        <div className={`cursor-pointer p-5 font-bold w-[150px] skeleton2-bg flex items-center`} ><div className="skeleton1-bg w-[100px] h-[30px]"></div></div>
                        <div className={`cursor-pointer p-5 font-bold w-[150px]  skeleton2-bg`} ><div className="skeleton1-bg w-[100px] h-[30px]"></div></div>
                    </div>
                </div>
                <div className="lg:w-2/3 w-full grid grid-cols-3 gap-5">
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center  gap-2">
                        <RocketIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Rocket</div>
                        <div className={`cursor-pointer p-5 font-bold w-[100px] h-[30px] skeleton2-bg`} ></div>
                    </div>
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center  gap-2">
                        <BoltIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Blitz</div>
                        <div className={`cursor-pointer p-5 font-bold w-[100px] h-[30px] skeleton2-bg`} ></div>
                    </div>
                    <div className="w-full py-5 general-backgroundcolor flex flex-col justify-center items-center gap-2">
                        <SpeedIcon sx={{ fontSize: 40 }} />
                        <div className="font-medium">Rapid</div>
                        <div className={`cursor-pointer p-5 font-bold w-[100px] h-[30px] skeleton2-bg`} ></div>
                    </div>
                </div>
                <div className="lg:w-3/4 w-full  flex flex-col general-backgroundcolor">
                    <div className="min-w-[900px]">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-2 font-semibold bg-[#454441] whitespace-nowrap">
                            <div className="w-full whitespace-nowrap">
                                Player
                            </div>
                            <div className="w-full whitespace-nowrap">Result</div>
                            <div className="w-full whitespace-nowrap">Moves</div>
                            <div className="w-full whitespace-nowrap">Date</div>
                        </div>
                    </div>
                    <div className="min-w-[900px]">
                        <div
                            className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-2 font-semibold border-t border-gray-500 hover:opacity-50 cursor-pointer whitespace-nowrap"
                        >
                            <div className="w-full flex items-center gap-2">
                                <div className="w-[40px] h-[40px] skeleton2-bg"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="w-[80px] h-[20px] skeleton1-bg"></div>
                                    <div className="w-[80px] h-[20px] skeleton1-bg"></div>
                                </div>
                            </div>

                            <div className="w-full whitespace-nowrap">
                                <div className="w-[40px] h-[20px] skeleton2-bg"></div>
                            </div>

                            <div className="w-full whitespace-nowrap">
                                <div className="w-[40px] h-[20px] skeleton2-bg"></div>
                            </div>

                            <div className="w-full whitespace-nowrap">
                                <div className="w-[150px] h-[20px] skeleton2-bg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileSkeleton