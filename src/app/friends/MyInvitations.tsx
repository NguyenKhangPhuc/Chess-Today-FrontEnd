import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { Invitations, PageParam, PaginationAttributes, ProfileAttributes } from "../types/types"
import { acceptInvitation, deleteSentInvitation, getMyInvitations } from "../services"
import { useState } from "react"
import { Person2 } from "@mui/icons-material"

const MyInvitations = ({ me, isAvailable, queryClient }: { me: ProfileAttributes, isAvailable: boolean, queryClient: QueryClient }) => {
    const [cursor, setCursor] = useState<PageParam | undefined>()
    const { data } = useQuery<PaginationAttributes<Invitations>>({
        queryKey: ['my_invitations'],
        queryFn: () => getMyInvitations(me.id, cursor?.after, cursor?.before)
    })
    console.log(data)
    const acceptInvitationMutation = useMutation({
        mutationKey: ['accept_invitation'],
        mutationFn: acceptInvitation,
        onSuccess: (data) => {
            console.log(data)
            alert('Accept invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['my_invitations', 'users'] })
        }
    })
    const deleteSentInvitationMutation = useMutation({
        mutationKey: ['delete_invitation'],
        mutationFn: deleteSentInvitation,
        onSuccess: () => {
            alert('Delete invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] })
        }
    })
    const handleAcceptInvitation = (invitationId: string, friendId: string) => {
        console.log(invitationId, friendId)
        acceptInvitationMutation.mutate({ invitationId, friendId })
    }
    const handleDeleteSentInvitation = (invitationId: string) => {
        console.log(invitationId)
        deleteSentInvitationMutation.mutate(invitationId)
    }
    if (!isAvailable || !data) return null
    return (
        <>
            {data.data.map((e) => {
                return (
                    <div className='w-full flex gap-5 items-center justify-between' key={`$friends ${e.id}`}>
                        <div className='flex items-center gap-5'>
                            <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                                <Person2 sx={{ color: 'black' }} />

                            </div>
                            <div className='font-bold'>{e.sender?.name}</div>
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
                                onClick={() => handleAcceptInvitation(e.id, e.senderId)}
                            >Accept</button>
                            <button
                                className="
                                            px-4 py-2 rounded-md font-semibold
                                            bg-[#302e2b] text-white
                                            hover:bg-[#3a3734] 
                                            cursor-pointer
                                            transition
                                            "
                                aria-label="Decline invitation"
                                onClick={() => handleDeleteSentInvitation(e.id)}
                            >Decline</button>
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
export default MyInvitations