import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Person2 } from "@mui/icons-material"
import { ProfileAttributes, UserBasicAttributes } from "../types/user"
import { PageParam } from "../types/types"
import Loader from "../Components/Loader"
import { useGetInvitations } from "../hooks/query-hooks/useGetInvitations"
import { useAcceptInvitations } from "../hooks/mutation-hooks/useAcceptInvitations"
import { useDeleteInvitations } from "../hooks/mutation-hooks/useDeleteInvitation"
import { Socket } from "socket.io-client"
import Link from "next/link"

// Component to show the invitation where the user is the receiver
const MyInvitations = ({ me, isAvailable, queryClient, socket }: { me: UserBasicAttributes, isAvailable: boolean, queryClient: QueryClient, socket: Socket }) => {
    // Cursor to manage the current page of the invitations data
    const [cursor, setCursor] = useState<PageParam | undefined>()
    // Get all the invitation where user is the receiver by using userId
    const { data: invitations, isLoading } = useGetInvitations({ userId: me.id, cursor })
    // Mutation to accept the invitation to be friend
    const { acceptInvitationMutation } = useAcceptInvitations({ queryClient, socket })
    // Mutation to delete the invitation to be friend
    const { deleteSentInvitationMutation } = useDeleteInvitations({ queryClient, socket })
    // Function to handle accept the invitation
    const handleAcceptInvitation = (invitationId: string, friendId: string) => {
        acceptInvitationMutation.mutate({ invitationId, friendId })
    }
    // Function to handle delete the invitation
    const handleDeleteSentInvitation = (invitationId: string) => {
        deleteSentInvitationMutation.mutate(invitationId)
    }
    if (!isAvailable) return null
    if (!invitations || isLoading) return (
        <div className="w-full  flex justify-center items-center"><Loader /></div>
    )
    return (
        <>
            {invitations.data.map((e) => {
                return (
                    <div className='w-full flex gap-5 items-center justify-between' key={`$invitations from ${e.id}`}>
                        <div className='flex items-center gap-5'>
                            <Link className='w-16 h-16 p-5 bg-gray-300 rounded-lg' href={`/profile/${e.id}`}>
                                <Person2 sx={{ color: 'black' }} />

                            </Link>
                            <div className='font-bold'>{e.sender?.name}</div>
                        </div>
                        <div className='flex sm:flex-row flex-col gap-5'>
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
                    disabled={invitations?.hasPrevPage !== undefined ? !invitations.hasPrevPage : true}
                    className={`${invitations?.hasPrevPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ before: invitations?.prevCursor, after: undefined })}
                >
                    <div className='font-bold text-base'>Previous Page</div>
                </button>
                <button
                    disabled={invitations?.hasNextPage !== undefined ? !invitations.hasNextPage : true}
                    className={`${invitations?.hasNextPage ? 'cursor-pointer w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative hover:bg-[#454441]' : ' w-[200px] p-3 bg-[#302e2b] flex items-center justify-center gap-3 relative opacity-40'}`}
                    onClick={() => setCursor({ after: invitations?.nextCursor, before: undefined })}>
                    <div className='font-bold text-base'>Next Page</div>
                </button>
            </div >
        </>
    )
}
export default MyInvitations