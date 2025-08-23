import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Person2 } from "@mui/icons-material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PageParam } from "../types/types";
import { PaginationAttributes } from "../types/pagination";
import { UserAttributes } from "../types/user";
import { sendInvitation } from "../services/invitations";
import { getUsers } from "../services/user";
import Loader from "../Components/Loader";

const UsersList = ({ isAvailable, queryClient }: { isAvailable: boolean, queryClient: QueryClient }) => {
    const [cursor, setCursor] = useState<PageParam | undefined>()
    const { data, isLoading } = useQuery<PaginationAttributes<UserAttributes>>({
        queryKey: ['users'],
        queryFn: () => getUsers(cursor?.after, cursor?.before)
    })

    const createInvitationMutation = useMutation({
        mutationKey: ['create_invitation'],
        mutationFn: sendInvitation,
        onSuccess: (data) => {
            alert('Invitation sent')
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['current_user'] })
        }

    })
    const handleCreateInvitation = (receiverId: string) => {
        console.log(receiverId)
        createInvitationMutation.mutate(receiverId)
    }
    if (!isAvailable) return null
    if (!data || isLoading) return (
        <div className="w-full  flex justify-center items-center"><Loader /></div>
    )
    return (
        <>
            {data.data.map((e) => {
                return (
                    <div className='w-full flex gap-5 items-center justify-between' key={`$friends ${e.id}`}>
                        <div className='flex items-center gap-5'>
                            <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                                <Person2 sx={{ color: 'black' }} />

                            </div>
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
            </div >
        </>
    )
}

export default UsersList