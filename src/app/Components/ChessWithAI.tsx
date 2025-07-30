'use client'

import ChessboardCopmonent from "@/app/Components/Chessboard"
import PersonIcon from '@mui/icons-material/Person';
import { useState } from "react";

const ChessWithAI = () => {
    const [message, setMessage] = useState<Array<string>>([])
    return (
        <div className="w-full h-screen flex p-5 justify-center">
            <div className="w-1/2 flex flex-col justify-around text-white ">
                <div className="w-full flex gap-5">
                    <PersonIcon />
                    <div className="font-bold">AI Chess</div>
                </div>
                <div className="w-full">
                    <ChessboardCopmonent message={message} setMessage={setMessage} />
                </div>
                <div className="w-full  flex gap-5 ">
                    <PersonIcon />
                    <div className="font-bold">AI Chess</div>
                </div>
            </div>
            <div className="w-1/3 h-full general-backgroundcolor flex flex-col text-white rounded-xl">
                <div className="w-full flex justify-around bg-[#6e3410] rounded-xl">
                    <div className="p-5">Ván cờ mới</div>
                    <div className="p-5">Phân tích</div>
                    <div className="p-5">Kỳ thủ</div>
                    <div className="p-5">Các ván đâu</div>
                </div>
                <div className="w-full flex justify-around ">
                    <div className="w-1/2 text-center p-5 border-b-3 border-gray-500">Các nước đi</div>
                    <div className="w-1/2 text-center p-5 border-b border-gray-500">Thông tin</div>
                </div>
                <div className="flex flex-col p-5 max-h-[300px] overflow-y-auto">
                    <div className="w-full bg-black flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                    <div className="w-full  flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                    <div className="w-full bg-black flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                    <div className="w-full  flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                    <div className="w-full bg-black flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                    <div className="w-full  flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                    <div className="w-full bg-black flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                    <div className="w-full  flex gap-10 p-2 rounded-full">
                        <div>1.</div>
                        <div>e3</div>
                        <div>e5</div>
                    </div>
                </div>
                <div className="w-full flex gap-2 p-5">
                    <button
                        className="cursor-pointer bg-[#6e3410] w-1/2 p-3 rounded-lg shadow-xl/30 font-bold text-xl hover:-translate-y-2  hover:scale-105 duration-300"

                    >
                        New game
                    </button>
                    <button
                        className="cursor-pointer bg-[#6e3410] w-1/2 p-3 rounded-lg shadow-xl/30 font-bold text-xl hover:-translate-y-2  hover:scale-105 duration-300"
                    >
                        Play again
                    </button>
                </div>
                <div className="w-full flex flex-col px-5">
                    <div className="font-bold  border-b border-gray-600 py-5"> Your AI Teacher</div>
                    <div className="w-full flex flex-col border-b border-gray-600 gap-2 h-[200px] overflow-y-auto">

                        {message.map((e) => {
                            return (
                                <div className="w-1/2 bg-black text-white p-2 break-words rounded-xl" key={`Message ${e}`}>
                                    {e}
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-full flex gap-2 mt-5">
                        <input className="outline-none w-2/3 p-3 border-b border-gray-500" placeholder="Send your text" />
                        <button
                            className="cursor-pointer bg-[#6e3410] w-1/3 rounded-lg shadow-xl/30 font-bold text-xl hover:-translate-y-2  hover:scale-105 duration-300"
                        >Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChessWithAI