import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
    return (
        <div className="max-w-7xl mx-auto flex justify-center items-center py-10">
            <div className="w-full flex flex-col  gap-5">
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
                        <Image src={'/assets/chinesechessboard.png'} width={250} height={200} alt="Chessboard" className="rounded-lg shadow-lg " />
                        <div className="text-center text-[#ad6717] font-bold text-lg p-2">Xiangqui</div>
                    </div>
                    <div className=" flex flex-col border-1 border-white/10 rounded-lg shadow-lg">
                        <Image src={'/assets/goboard.png'} width={250} height={200} alt="Chessboard" className="rounded-lg shadow-lg" />
                        <div className="text-center text-[#ad6717] font-bold text-lg p-2">Go</div>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-10 text-white">
                <div className="text-4xl text-center font-bold ">Explore The World of Strategic Board Games at ChessToday!</div>
                <div className="w-full flex flex-col items-center">
                    <div className="font-light italic text-sm text-center">We are in development process!</div>
                    <div className="font-light italic text-sm text-center">Give it a try!</div>
                </div>
                <div className="w-full flex flex-col justify-center items-center gap-5">
                    <Link href={'/game-mode/chess'} className="w-1/2">
                        <button
                            className="cursor-pointer bg-[#6e3410] w-full p-5 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2 hover:scale-105 duration-300"

                        >
                            Play Now!
                        </button>
                    </Link>
                    <button
                        className="cursor-pointer bg-gray-700 w-1/2 p-5 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2 hover:scale-105 duration-300">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}

const SuggestionSection = () => {
    return (
        <div className="max-w-7xl mx-auto py-10 flex flex-col items-center gap-10 text-white">
            <div className="w-full p-10 flex general-backgroundcolor justify-around rounded-xl">
                <div className="w-1/2 h-auto  flex flex-col items-center justify-between gap-10 ">
                    <div className="text-center font-bold text-3xl">Playing Chess</div>
                    <div className="w-full flex flex-col justify-center items-center gap-5">
                        <button
                            className="cursor-pointer bg-[#6e3410] w-1/2 p-5 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2  hover:scale-105 duration-300"
                        >
                            Play Now!
                        </button>
                    </div>
                    <div className="flex gap-5">
                        <Image src={'/assets/chessposter.jpg'} width={200} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
                        <div className="flex flex-col">
                            <div className="font-light">“One of the principal requisites of good chess is the ability to treat both middle and end game equally well.”</div>
                            <div className="font-bold">Magnus Carlsen</div>
                        </div>
                    </div>
                </div>
                <Image src={'/assets/chessboard.png'} width={400} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
            </div>

            <div className="w-full p-10 flex general-backgroundcolor justify-around rounded-xl">
                <Image src={'/assets/chinesechessboard.png'} width={400} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
                <div className="w-1/2 h-auto  flex flex-col items-center justify-between gap-10 ">
                    <div className="text-center font-bold text-3xl">Playing Chess</div>
                    <div className="w-full flex flex-col justify-center items-center gap-5">
                        <button
                            className="cursor-pointer bg-[#6e3410] w-1/2 p-5 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2  hover:scale-105 duration-300"
                        >
                            Play Now!
                        </button>
                    </div>
                    <div className="flex gap-5">
                        <Image src={'/assets/chessposter.jpg'} width={200} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
                        <div className="flex flex-col">
                            <div className="font-light">“One of the principal requisites of good chess is the ability to treat both middle and end game equally well.”</div>
                            <div className="font-bold">Magnus Carlsen</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full p-10 flex general-backgroundcolor justify-around rounded-xl">
                <div className="w-1/2 h-auto  flex flex-col items-center justify-between gap-10 ">
                    <div className="text-center font-bold text-3xl">Playing Chess</div>
                    <div className="w-full flex flex-col justify-center items-center gap-5">
                        <button
                            className="cursor-pointer bg-[#6e3410] w-1/2 p-5 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2  hover:scale-105 duration-300"
                        >
                            Play Now!
                        </button>
                    </div>
                    <div className="flex gap-5">
                        <Image src={'/assets/chessposter.jpg'} width={200} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
                        <div className="flex flex-col">
                            <div className="font-light">“One of the principal requisites of good chess is the ability to treat both middle and end game equally well.”</div>
                            <div className="font-bold">Magnus Carlsen</div>
                        </div>
                    </div>
                </div>
                <Image src={'/assets/goboard.png'} width={400} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
            </div>
            <div className="w-full p-10 flex general-backgroundcolor justify-around rounded-xl">
                <Image src={'/assets/caroboard.png'} width={400} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
                <div className="w-1/2 h-auto  flex flex-col items-center justify-between gap-10 ">
                    <div className="text-center font-bold text-3xl">Playing Chess</div>
                    <div className="w-full flex flex-col justify-center items-center gap-5">
                        <button
                            className="cursor-pointer bg-[#6e3410] w-1/2 p-5 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2  hover:scale-105 duration-300"
                        >
                            Play Now!
                        </button>
                    </div>
                    <div className="flex gap-5">
                        <Image src={'/assets/chessposter.jpg'} width={200} height={300} alt="Chessboard" className=" rounded-lg shadow-lg" />
                        <div className="flex flex-col">
                            <div className="font-light">“One of the principal requisites of good chess is the ability to treat both middle and end game equally well.”</div>
                            <div className="font-bold">Magnus Carlsen</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const HomePage = () => {
    return (
        <div className="w-full h-auto ">
            <HeroSection />
            <SuggestionSection />
        </div>
    )
}
export default HomePage;