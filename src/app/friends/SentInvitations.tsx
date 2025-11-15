import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Person2 } from "@mui/icons-material"
import { ProfileAttributes } from "../types/user"
import { PageParam } from "../types/types"
import Loader from "../Components/Loader"
import { useDeleteInvitations } from "../hooks/mutation-hooks/useDeleteInvitation"
import { useGetSentInvitations } from "../hooks/query-hooks/useGetSentInvitations"
import { Socket } from "socket.io-client"
const SentInvitations = ({ me, isAvailable, queryClient, socket }: { me: ProfileAttributes, isAvailable: boolean, queryClient: QueryClient, socket: Socket }) => {
    const [cursor, setCursor] = useState<PageParam | undefined>()
    const { data: sentInvitations, isLoading } = useGetSentInvitations({ userId: me.id, cursor })
    console.log(sentInvitations)
    const { deleteSentInvitationMutation } = useDeleteInvitations({ queryClient });

    const handleDeleteSentInvitation = (invitationId: string) => {
        console.log(invitationId)
        deleteSentInvitationMutation.mutate(invitationId)
    }
    if (!isAvailable) return null
    if (!sentInvitations || isLoading) return (
        <div className="w-full  flex justify-center items-center"><Loader /></div>
    )
    return (
        <>
            {sentInvitations.data.map((e) => {
                return (
                    <div className='w-full flex gap-5 items-center justify-between' key={`$friends ${e.id}`}>
                        <div className='flex items-center gap-5'>
                            <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                                <Person2 sx={{ color: 'black' }} />

                            </div>
                            <div className='font-bold'>{e.receiver?.name}</div>
                            <div className='text-sm opacity-30'>{e.status}</div>
                        </div>
                        <div className='flex gap-5'>
                            <button
                                className="
                                            px-4 py-2 rounded-md font-semibold
                                            bg-red-600 text-white
                                            hover:bg-red-700 
                                             cursor-pointer
                                            transition
                                            "
                                aria-label="Accept invitation"
                                onClick={() => handleDeleteSentInvitation(e.id)}
                            >Delete</button>
                        </div>
                    </div>
                )
            })}
            < div className="w-full flex gap-5 justify-end " >
                <button
                    disabled={sentInvitations?.hasPrevPage !== undefined ? !sentInvitations.hasPrevPage : true}
                    className={`${sentInvitations?.hasPrevPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ before: sentInvitations?.prevCursor, after: undefined })}
                >
                    <div className='font-bold text-base'>Previous Page</div>
                </button>
                <button
                    disabled={sentInvitations?.hasNextPage !== undefined ? !sentInvitations.hasNextPage : true}
                    className={`${sentInvitations?.hasNextPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ after: sentInvitations?.nextCursor, before: undefined })}>
                    <div className='font-bold text-base'>Next Page</div>
                </button>
            </div >
        </>
    )
}

export default SentInvitations