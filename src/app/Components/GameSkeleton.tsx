import { Chessboard } from "react-chessboard"
import { Person2, RestartAlt } from "@mui/icons-material"
const GameSkeleton = () => {
    return (
        <div className="w-full min-h-screen flex xl:flex-row flex-col items-center justify-center gap-5 bg-[#1a1917]">

            <div className='lg:h-[850px] md:h-[750px] flex flex-col items-center justify-between'>
                <div
                    className={`w-full flex items-center justify-between p-3 rounded-xl border bg-[#1f1e1b]/90 shadow-sm transition-all duration-300`}
                >

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#302e2b] rounded-xl border border-[#454441] shadow-inner">
                            <Person2 sx={{ color: 'white', fontSize: 20 }} />
                        </div>
                        <div className="flex flex-col leading-tight gap-1">
                            <div className='w-[150px] h-[30px] skeleton2-bg'></div>
                            <div className='w-[80px] h-[20px] skeleton2-bg'></div>
                        </div>
                    </div>

                    <div
                        className={`w-[110px] text-center py-1 rounded-lg font-semibold text-lg tracking-wider skeleton1-bg flex items-center justify-center`}
                    >
                        <div className='w-[70px] h-[30px] skeleton2-bg'></div>
                    </div>
                </div>
                <div className="lg:w-[710px] lg:h-[710px] md:w-[600px] md:h-[600px] ">
                    <Chessboard options={{
                        boardStyle: { width: '100%', height: '100%' },
                    }} />
                </div>
                <div
                    className={`w-full flex items-center justify-between p-3 rounded-xl border bg-[#1f1e1b]/90 shadow-sm transition-all duration-300`}
                >

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#302e2b] rounded-xl border border-[#454441] shadow-inner">
                            <Person2 sx={{ color: 'white', fontSize: 20 }} />
                        </div>
                        <div className="flex flex-col leading-tight gap-1">
                            <div className='w-[150px] h-[30px] skeleton2-bg'></div>
                            <div className='w-[80px] h-[20px] skeleton2-bg'></div>
                        </div>
                    </div>

                    <div
                        className={`w-[110px] text-center py-1 rounded-lg font-semibold text-lg tracking-wider skeleton1-bg flex items-center justify-center`}
                    >
                        <div className='w-[70px] h-[30px] skeleton2-bg'></div>
                    </div>
                </div>
            </div>


            <div className="xl:w-1/3 w-full flex flex-col rounded-2xl shadow-xl bg-[#1f1e1b] border border-[#2c2b29] overflow-hidden text-white">


                <div className="flex text-sm font-semibold uppercase tracking-wider border-b border-[#3a3937]">
                    <div className="w-1/2 text-center p-4 bg-[#302e2b] border-r border-[#3a3937] cursor-pointer hover:bg-[#3a3835] transition">
                        Các nước đi
                    </div>
                    <div className="w-1/2 text-center p-4 bg-[#1f1e1b] cursor-pointer hover:bg-[#2a2926] transition">
                        Thông tin
                    </div>
                </div>


                <div className="h-[300px] overflow-y-auto bg-black/20 p-2 rounded-b-lg ">
                    <div className="flex flex-wrap">
                        <div className={`w-1/2 flex items-center justify-center gap-2 py-2 font-medium bg-[#2a2926]/80`}>
                            <div className='w-[80px] h-[20px] skeleton2-bg'></div>
                        </div>
                        <div className={`w-1/2 flex items-center justify-center gap-2 py-2 font-medium `}>
                            <div className='w-[80px] h-[20px] skeleton2-bg'></div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 px-5 mt-3">
                    <div
                        className="w-1/2 py-3 bg-[#302e2b] font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <div className='w-[80px] h-[30px] skeleton2-bg'></div>
                    </div>
                    <div
                        className="w-1/2 py-3 bg-[#302e2b] font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <div className='w-[80px] h-[30px] skeleton2-bg'></div>
                    </div>
                </div>

                <div className="mt-4 border-t border-[#3a3937]">
                    <div className="flex flex-col w-full h-[300px] bg-[#1c1b1a]  shadow-md p-4 text-sm mt-5">

                        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                            <div className="font-semibold text-gray-200">
                                <div className='w-[300px] h-[30px] skeleton2-bg'></div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex flex-col flex-1 overflow-y-auto space-y-3 pr-2">
                            <div

                                className={`flex flex-col items-end w-full`}
                            >
                                <div className="text-[10px] text-gray-400 mb-1">
                                    <div className='w-[100px] h-[20px] skeleton2-bg'></div>
                                </div>
                                <div
                                    className={`px-3 py-2 max-w-[70%] rounded-2xl break-words bg-[#3b3a38] text-white rounded-br-none`}
                                >
                                    <div className='w-[200px] h-[100px] skeleton2-bg'></div>
                                </div>
                            </div>
                            <div

                                className={`flex flex-col items-start w-full`}
                            >
                                <div className="text-[10px] text-gray-400 mb-1">
                                    <div className='w-[100px] h-[20px] skeleton2-bg'></div>
                                </div>
                                <div
                                    className={`px-3 py-2 max-w-[70%] rounded-2xl break-words bg-[#3b3a38] text-white rounded-br-none`}
                                >
                                    <div className='w-[200px] h-[100px] skeleton2-bg'></div>
                                </div>
                            </div>
                        </div>

                        {/* Input area */}
                        <div className="mt-3 flex items-center gap-2 skeleton1-bg">
                            <div className='flex-1 px-3 py-2 skeleton2-bg'></div>
                            <div className='flex items-center justify-center bg-[#6e3410] hover:bg-[#844a25] transition text-white font-semibold px-4 py-2 rounded-lg '>
                                <div className='w-[24px] h-[24px] skeleton2-bg'></div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameSkeleton