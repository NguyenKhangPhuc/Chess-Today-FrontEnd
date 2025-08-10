'use client'
import Diversity1Icon from '@mui/icons-material/Diversity1';
import LinkIcon from '@mui/icons-material/Link';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe } from '../services';
import { ProfileAttributes } from '../types/types';
import { useState } from 'react';
import FriendList from '../Components/FriendList';
import MyInvitations from './MyInvitations';
import SentInvitations from './SentInvitations';
import UsersList from './UserList';




const Home = () => {
    const queryClient = useQueryClient()
    const [option, setOption] = useState('friendList')
    const { data: me } = useQuery<ProfileAttributes, Error>({
        queryKey: ['current_user'],
        queryFn: getMe
    })

    console.log(me)
    if (!me) return null
    return (
        <div className='w-full scroll-smooth min-h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex gap-10 text-white'>
                <div className='w-2/3 flex flex-col gap-10'>
                    <div className="flex gap-5 font-bold items-center">
                        <Diversity1Icon sx={{ fontSize: 40 }} />
                        <div className='text-3xl'>Friends</div>
                    </div>
                    <div className='w-full grid grid-cols-2 gap-2 font-bold text-xl'>
                        <div className='cursor-pointer w-full flex items-center text-center bg-[#262522] px-15 py-10 gap-5 relative hover:bg-[#454441]'
                            onClick={() => setOption('friendList')}>
                            <LinkIcon sx={{ fontSize: 30 }} />
                            <div>My Connections</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center bg-[#262522] px-15 py-10 gap-5 relative hover:bg-[#454441]'
                            onClick={() => setOption('people')}>
                            <Diversity2Icon sx={{ fontSize: 30 }} />
                            <div>People</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center bg-[#262522] px-15 py-10 gap-5 relative hover:bg-[#454441]'
                            onClick={() => setOption('sentInvitations')}>
                            <SendIcon sx={{ fontSize: 30 }} />
                            <div>Sent Invitations </div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                        <div className='cursor-pointer w-full flex items-center text-center bg-[#262522] px-15 py-10 gap-5 relative hover:bg-[#454441]'
                            onClick={() => setOption('myInvitations')}>
                            <EmailIcon sx={{ fontSize: 30 }} />
                            <div>My Invitations</div>
                            <div className='absolute right-5'>
                                <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-col general-backgroundcolor p-5 gap-5'>
                        <FriendList me={me} isAvailable={option === 'friendList'} queryClient={queryClient} />
                        <UsersList isAvailable={option === 'people'} queryClient={queryClient} />
                        <MyInvitations me={me} isAvailable={option === 'myInvitations'} queryClient={queryClient} />
                        <SentInvitations me={me} isAvailable={option === 'sentInvitations'} queryClient={queryClient} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home