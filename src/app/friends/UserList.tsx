import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Person2 } from "@mui/icons-material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PageParam } from "../types/types";
import Loader from "../Components/Loader";
import { useUsers } from "../hooks/query-hooks/useUsers";
import { useCreateNewInvitation } from "../hooks/mutation-hooks/useCreateInvitation";
import { Socket } from "socket.io-client";
import { UserBasicAttributes } from "../types/user";
import Link from "next/link";

const UsersList = ({ isAvailable, me, queryClient, socket }: { isAvailable: boolean, me: UserBasicAttributes, queryClient: QueryClient, socket: Socket }) => {
    const [cursor, setCursor] = useState<PageParam | undefined>()
    const { users, isLoading } = useUsers(cursor)
    const { createInvitationMutation } = useCreateNewInvitation({ queryClient, socket, sender: me })
    const handleCreateInvitation = (receiverId: string) => {
        console.log(receiverId)
        createInvitationMutation.mutate(receiverId)
    }
    if (!isAvailable) return null
    if (!users || isLoading) return (
        <div className="w-full  flex justify-center items-center"><Loader /></div>
    )
    console.log("This is users", users)
    return (
        <>
            {users.data.map((e) => {
                return (
                    <div className='w-full flex gap-5 items-center justify-between' key={`user ${e.id}`}>
                        <div className='flex items-center gap-5'>
                            <Link className='w-16 h-16 p-5 bg-gray-300 rounded-lg' href={`/profile/${e.id}`}>
                                <Person2 sx={{ color: 'black' }} />

                            </Link>
                            <div className='font-bold'>{e.name}</div>
                        </div>
                        <div className='flex gap-5'>
                            <div onClick={() => handleCreateInvitation(e.id)}><PersonAddIcon className='cursor-pointer opacity-70 hover:opacity-100 duration-300' /></div>
                        </div>
                    </div>
                )
            })}
            < div className="w-full flex gap-5 justify-end " >
                <button
                    disabled={users?.hasPrevPage !== undefined ? !users.hasPrevPage : true}
                    className={`${users?.hasPrevPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ before: users?.prevCursor, after: undefined })}
                >
                    <div className='font-bold text-base'>Previous Page</div>
                </button>
                <button
                    disabled={users?.hasNextPage !== undefined ? !users.hasNextPage : true}
                    className={`${users?.hasNextPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ after: users?.nextCursor, before: undefined })}>
                    <div className='font-bold text-base'>Next Page</div>
                </button>
            </div >
        </>
    )
}

export default UsersList