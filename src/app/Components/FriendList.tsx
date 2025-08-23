import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Person2 } from "@mui/icons-material"
import GamesIcon from '@mui/icons-material/Games';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { PageParam } from "../types/types";
import { FriendShipAttributes } from "../types/friend";
import { PaginationAttributes } from "../types/pagination";
import { ProfileAttributes } from "../types/user";
import { deleteFriendShip, getUserFriend } from "../services/friendship";

const FriendList = ({ me, isAvailable, queryClient }: { me: ProfileAttributes, isAvailable: boolean, queryClient: QueryClient }) => {
    const [cursor, setCursor] = useState<PageParam | undefined>()
    const { data } = useQuery<PaginationAttributes<FriendShipAttributes>>({
        queryKey: [`friendship`, cursor],
        queryFn: () => getUserFriend(me?.id, cursor?.after, cursor?.before),
        enabled: !!me?.id
    })
    const deleteFriendShipMutation = useMutation({
        mutationKey: ['delete_friendship'],
        mutationFn: deleteFriendShip,
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['current_user', 'users'] })
            alert('Delete successfully')
        }
    })
    const handleDeleteFriendShip = (friendShipId: string) => {
        console.log(friendShipId)
        deleteFriendShipMutation.mutate(friendShipId)
    }
    if (!isAvailable) return null
    return (
        <>
            {data?.data.map((e) => {
                return (
                    <div className='w-full flex gap-5 items-center justify-between' key={`$friends ${e.id}`}>
                        <div className='flex items-center gap-5'>
                            <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                                <Person2 sx={{ color: 'black' }} />

                            </div>
                            <div className='font-bold'>{me.id === e.userId ? e.friend?.name : e.user?.name}</div>
                        </div>
                        <div className='flex gap-5'>
                            <GamesIcon sx={{ fontSize: 20 }} className='cursor-pointer opacity-70 hover:opacity-100 duration-300' />
                            <ForwardToInboxIcon sx={{ fontSize: 20 }} className='cursor-pointer opacity-70 hover:opacity-100 duration-300' />
                            <div className='flex justify-center items-center' onClick={() => handleDeleteFriendShip(e.id)}><DeleteIcon sx={{ fontSize: 20 }} className='cursor-pointer opacity-70 hover:opacity-100 duration-300' /></div>
                        </div>
                    </div>
                )
            })}
            <div className="w-full flex gap-5 justify-end ">
                <button
                    disabled={data?.hasPrevPage !== undefined ? !data.hasPrevPage : true}
                    className={`${data?.hasPrevPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ before: data?.prevCursor, after: undefined })}
                >
                    <div className='font-bold text-base'>Previous Page</div>
                </button>
                <button
                    disabled={data?.hasNextPage !== undefined ? !data.hasNextPage : true}
                    className={`${data?.hasNextPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ after: data?.nextCursor, before: undefined })}>
                    <div className='font-bold text-base'>Next Page</div>
                </button>
            </div>
        </>
    )
}

export default FriendList