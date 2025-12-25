'use client'

import { Chessboard } from "react-chessboard"

const GameManagementSkeleton = () => {
    return (
        <div className={`w-full scroll-smooth min-h-screen relative`}>
            <div className={`max-w-7xl mx-auto py-10 flex flex-col  gap-10 text-white  `}>
                <div className='w-full  flex  justify-between rounded-xl'>
                    <div className='flex gap-2'>
                        <div className='font-bold w-[24px] h-[24px] skeleton2-bg'></div>
                        <div className='font-bold w-[60px] h-[24px] skeleton2-bg'></div>
                    </div>
                    <div className='flex gap-2'>
                        <div className='font-bold w-[24px] h-[24px] skeleton2-bg'></div>
                        <div className='font-bold w-[24px] h-[24px] skeleton2-bg'></div>
                        <div className='font-bold w-[24px] h-[24px] skeleton2-bg'></div>
                    </div>
                </div>
                <div className="w-full h-auto flex flex-col xl:flex-row gap-5">
                    <div className=' lg:h-[800px] md:h-[600px] flex flex-col items-center justify-between'>
                        <div className='lg:w-[710px] lg:h-[710px] md:w-[500px] md:h-[500px]'>
                            <Chessboard options={{

                                id: 'display',
                                boardStyle: { width: '100%', height: '100%' },

                            }} />
                        </div>
                    </div>
                    <div className='w-full px-5 py-3 h-[750px] general-backgroundcolor flex flex-col gap-5 items-center overflow-y-auto'>
                        <div className='w-full flex h-[30px]'>
                            <div className='w-full flex flex-col items-center text-center justify-center h-full '>
                                <div className='font-bold w-[24px] h-[24px] skeleton1-bg'></div>
                                <div className='font-bold w-[60px] h-[24px] skeleton2-bg'></div>
                            </div>
                            <div className='w-full flex flex-col items-center text-center justify-center'>
                                <div className='font-bold w-[24px] h-[24px] skeleton1-bg'></div>
                                <div className='font-bold w-[60px] h-[24px] skeleton2-bg'></div>
                            </div>
                        </div>
                        <div className='cursor-pointer w-full p-5 bg-[#302e2b] flex items-center justify-center gap-3 relative ' >
                            <div className='font-bold w-[40px] h-[40px] skeleton2-bg'></div>
                            <div className='font-bold w-[150px] h-[40px] skeleton2-bg'></div>
                            <div className='absolute right-5'>
                                <div className='font-bold w-[40px] h-[40px] skeleton2-bg'></div>
                            </div>
                        </div>

                        <button
                            className="cursor-pointer skeleton1-bg w-full p-5 font-bold text-xl flex justify-center"

                        >
                            <div className='font-bold w-[150px] h-[40px] skeleton2-bg'></div>
                        </button>
                        <div className='w-full flex flex-col gap-2 cursor-pointer'>
                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' >
                                <div className='font-bold w-[40px] h-[40px] skeleton2-bg'></div>
                                <div className='font-bold w-[150px] h-[40px] skeleton2-bg'></div>
                            </div>
                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' >
                                <div className='font-bold w-[40px] h-[40px] skeleton2-bg'></div>
                                <div className='font-bold w-[150px] h-[40px] skeleton2-bg'></div>
                            </div>

                            <div className='w-full p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]'>
                                <div className='font-bold w-[40px] h-[40px] skeleton2-bg'></div>
                                <div className='font-bold w-[150px] h-[40px] skeleton2-bg'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default GameManagementSkeleton