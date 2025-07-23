import Link from "next/link";

const NavBar = () => {
    return (
        <div className="h-screen max-w-40 bg-[#170f06] text-white fixed flex flex-col p-4 shadow-xl/90">
            <div className="text-2xl font-bold mb-6">♟ ChessToday</div>

            <Link href="/" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">

                <span>Home</span>
            </Link>

            <Link href="/play-ai" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">

                <span>Play vs AI</span>
            </Link>

            <Link href="/friends" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">

                <span>Play with Friends</span>
            </Link>

            <Link href="/login" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">

                <span>Login</span>
            </Link>
        </div>
    )
}

export default NavBar;