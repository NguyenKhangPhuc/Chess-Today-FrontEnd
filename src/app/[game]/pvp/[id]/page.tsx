'use client';
import ChessPvP from "@/app/Components/ChessPvP";
import { getGame, getMe } from "@/app/services";
import { GameAttributes, ProfileAttributes } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";


const Home = () => {
    const { game, id }: { game: string, id: string } = useParams()
    const { data, isLoading, refetch } = useQuery<GameAttributes>({
        queryKey: [`game ${id}`],
        queryFn: () => getGame(id),
    })
    const { data: userData } = useQuery<ProfileAttributes>({
        queryKey: ['current_user'],
        queryFn: getMe
    })
    if (isLoading || !data || !userData) return <div>isLoading</div>
    console.log(game)
    if (game === 'chess') {
        return (
            <div className="w-full min-h-screen flex ">
                <div className="w-auto h-full flex flex-col">
                    <div className=""></div>
                    <ChessPvP data={data} userData={userData} />
                </div>
            </div>
        )
    }
}

export default Home