'use client'
import Diversity1Icon from '@mui/icons-material/Diversity1';
import LinkIcon from '@mui/icons-material/Link';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptInvitation, deleteSentInvitation, getMe, getUsers, sendInvitation } from '../services';
import { Opacity, Person2 } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import GamesIcon from '@mui/icons-material/Games';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { Invitations, ProfileAttributes, UserAttributes } from '../types/types';
import { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const FriendList = ({ friendList, isAvailable }: { friendList: Array<UserAttributes>, isAvailable: boolean }) => {
    if (!isAvailable) return null
    return (
        <>
            {friendList.map((e) => {
                return (
                    <div className='w-full flex gap-5 items-center justify-between' key={`$friends ${e.id}`}>
                        <div className='flex items-center gap-5'>
                            <div className='w-16 h-16 p-5 bg-gray-300 rounded-lg'>
                                <Person2 sx={{ color: 'black' }} />

                            </div>
                            <div className='font-bold'>{e.name}</div>
                        </div>
                        <div className='flex gap-5'>
                            <GamesIcon sx={{ fontSize: 20 }} />
                            <ForwardToInboxIcon sx={{ fontSize: 20 }} />
                            <DeleteIcon sx={{ fontSize: 20 }} />
                        </div>
                    </div>
                )
            })}
        </>
    )
}

const UsersList = ({ users, isAvailable, queryClient }: { users: Array<UserAttributes>, isAvailable: boolean, queryClient: QueryClient }) => {

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
    return (
        users?.map((e) => {
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
        })
    )
}

const MyInvitations = ({ invitations, isAvailable, queryClient }: { invitations: Array<Invitations>, isAvailable: boolean, queryClient: QueryClient }) => {
    const acceptInvitationMutation = useMutation({
        mutationKey: ['accept_invitation'],
        mutationFn: acceptInvitation,
        onSuccess: (data) => {
            console.log(data)
            alert('Accept invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['current_user'] })
        }
    })
    const deleteSentInvitationMutation = useMutation({
        mutationKey: ['delete_invitation'],
        mutationFn: deleteSentInvitation,
        onSuccess: () => {
            alert('Delete invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['current_user'] })
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
    if (!isAvailable) return null
    return (
        <>
            {invitations.map((e) => {
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
        </>
    )
}

const SentInvitations = ({ invitations, isAvailable, queryClient }: { invitations: Array<Invitations>, isAvailable: boolean, queryClient: QueryClient }) => {
    const deleteSentInvitationMutation = useMutation({
        mutationKey: ['delete_invitation'],
        mutationFn: deleteSentInvitation,
        onSuccess: () => {
            alert('Delete invitation successfully')
            queryClient.invalidateQueries({ queryKey: ['current_user'] })
        }
    })

    const handleDeleteSentInvitation = (invitationId: string) => {
        console.log(invitationId)
        deleteSentInvitationMutation.mutate(invitationId)
    }
    if (!isAvailable) return null
    return (
        <>
            {invitations.map((e) => {
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
        </>
    )
}

const Home = () => {
    const queryClient = useQueryClient()
    const [option, setOption] = useState('friendlist')
    const { data: me } = useQuery<ProfileAttributes, Error>({
        queryKey: ['current_user'],
        queryFn: getMe
    })

    const { data: users } = useQuery<Array<UserAttributes>, Error>({
        queryKey: ['users'],
        queryFn: getUsers
    })

    console.log(me)
    console.log(users)
    const friendList = [...(me?.friends ?? []), ...(me?.friendOf ?? [])]
    return (
        <div className='w-full scroll-smooth min-h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex gap-10 text-white'>
                <div className='w-2/3 flex flex-col gap-10'>
                    <div className="flex gap-5 font-bold items-center">
                        <Diversity1Icon sx={{ fontSize: 40 }} />
                        <div className='text-3xl'>Friends</div>
                    </div>
                    <div className='w-full grid grid-cols-2 gap-2 font-bold text-xl'>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'
                            onClick={() => setOption('friendList')}>
                            <LinkIcon sx={{ fontSize: 30 }} />
                            <div>My Connections</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'
                            onClick={() => setOption('people')}>
                            <Diversity2Icon sx={{ fontSize: 30 }} />
                            <div>People</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'
                            onClick={() => setOption('sentInvitations')}>
                            <SendIcon sx={{ fontSize: 30 }} />
                            <div>Sent Invitations </div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center general-backgroundcolor px-15 py-10 gap-5 relative hover:-translate-y-2 hover:scale-102 duration-300'
                            onClick={() => setOption('myInvitations')}>
                            <EmailIcon sx={{ fontSize: 30 }} />
                            <div>My Invitations</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-col general-backgroundcolor p-5 gap-5'>
                        <FriendList friendList={friendList} isAvailable={option === 'friendList'} />
                        <UsersList users={users ? users : []} isAvailable={option === 'people'} queryClient={queryClient} />
                        <MyInvitations invitations={me?.receivedInvitations ?? []} isAvailable={option === 'myInvitations'} queryClient={queryClient} />
                        <SentInvitations invitations={me?.sentInvitations ?? []} isAvailable={option === 'sentInvitations'} queryClient={queryClient} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home