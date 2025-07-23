import Image from "next/image";

const HomePage = () => {
    return (
        <div className="w-full h-screen bg-[#170f06] py-10">
            <div className="max-w-7xl mx-auto p-10 flex justify-center items-center ">
                <div className="w-full flex flex-col items-center gap-5">
                    <div className="flex gap-5 ">
                        <div className=" flex flex-col border-1 border-white/10 rounded-lg shadow-lg">
                            <Image src={'/assets/chessboard.png'} width={250} height={200} alt="Chessboard" className="rounded-lg shadow-lg"></Image>
                            <div className="text-center text-[#ad6717] font-bold text-lg p-2">Chess</div>
                        </div>
                        <div className=" flex flex-col border-1 border-white/10 rounded-lg shadow-lg">
                            <Image src={'/assets/caroboard.png'} width={250} height={200} alt="Chessboard" className="rounded-lg shadow-lg" />
                            <div className="text-center text-[#ad6717] font-bold text-lg p-2">Caro</div>
                        </div>

                    </div>
                    <div className="flex gap-5">
                        <div className=" flex flex-col border-1 border-white/10 rounded-lg shadow-lg">
                            <Image src={'/assets/chinesechessboard.png'} width={250} height={200} alt="Chessboard" className="rounded-lg shadow-lg bg-yellow-600" />
                            <div className="text-center text-[#ad6717] font-bold text-lg p-2">Xiangqui</div>
                        </div>
                        <div className=" flex flex-col border-1 border-white/10 rounded-lg shadow-lg">
                            <Image src={'/assets/goboard.png'} width={250} height={200} alt="Chessboard" className="rounded-lg shadow-lg" />
                            <div className="text-center text-[#ad6717] font-bold text-lg p-2">Go</div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center gap-10 text-white">
                    <div className="text-4xl text-center font-bold text-shadow-md/100">Explore The World of Strategic Board Games at ChessToday!</div>
                    <div className="w-full flex flex-col items-center">
                        <div className="font-light italic text-sm text-center">We are in development process!</div>
                        <div className="font-light italic text-sm text-center">Give it a try!</div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center gap-5">
                        <button
                            className="cursor-pointer bg-[#ad6717] w-1/2 p-5 rounded-lg shadow-xl/30 font-bold text-2xl text-shadow-sm/50 hover:-translate-y-2 hover:text-shadow-sm/70 hover:shadow-xl/40 hover:scale-105 duration-300"
                        >
                            Play Now!
                        </button>
                        <button
                            className="cursor-pointer bg-gray-700 w-1/2 p-5 rounded-lg shadow-xl/30 font-bold text-2xl text-shadow-sm/50 hover:-translate-y-2 hover:text-shadow-sm/70 hover:shadow-xl/40 hover:scale-105 duration-300">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default HomePage;