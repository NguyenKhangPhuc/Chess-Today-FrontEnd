'use client';
import ChessPvP from "@/app/Components/ChessPvP";
import { useParams, useRouter, useSearchParams } from "next/navigation";


const Home = () => {
    const { game } = useParams()
    if (game === 'chess') {
        return (
            <ChessPvP />
        )
    }
}

export default Home