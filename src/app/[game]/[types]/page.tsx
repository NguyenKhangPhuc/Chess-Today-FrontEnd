'use client';
import ChessPvP from "@/app/Components/ChessPvP";
import ChessWithAI from "@/app/Components/ChessWithAI";
import XiangqiBoard from "@/app/Components/XiangqiBoard";
import { useParams } from "next/navigation";


const Home = () => {
    const { game, types } = useParams()

    if (game === 'chess' && types === 'learn-with-ai') {
        return (
            <ChessWithAI />
        )
    }

}

export default Home