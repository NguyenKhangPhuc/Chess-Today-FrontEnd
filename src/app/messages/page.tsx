'use client'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import AddIcon from '@mui/icons-material/Add';
import SmsIcon from '@mui/icons-material/Sms';
import { Person2 } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect, useState } from 'react';
import { getSocket } from '../libs/sockets';
import dayjs from 'dayjs';
import { ChatBoxAttributes } from '../types/chatbox';
import { MessageAttributes } from '../types/message';
import Loader from '../Components/Loader';
import { useMe } from '../hooks/query-hooks/useMe';
import { useGetChatBoxes } from '../hooks/query-hooks/useGetChatBoxes';
import { useCreateNewChatBox } from '../hooks/mutation-hooks/useCreateNewChatBox';
import MessagesSkeleton from './skeleton';

// Page to handle messaging with other friends
const Home = () => {
    const socket = getSocket()
    // State to open the possible chatbox that can be created
    const [openCreateChatBox, setOpenCreateChatBox] = useState(false)
    // State to manage the current chatbox 
    const [currentChatBox, setCurrentChatBox] = useState<ChatBoxAttributes | undefined>(undefined)
    // State to mange the input value of the message
    const [message, setMessage] = useState('')
    // Query client to invalidate the query
    const queryClient = useQueryClient()
    // Get the user full information with this custom hook
    const { me, isLoading } = useMe()
    // Get all the chatboxes of the user
    const { data: chatBoxes, isLoading: isLoadingChatBox } = useGetChatBoxes();
    // Mutation to create a new chatbox
    const { createNewChatBoxMutation } = useCreateNewChatBox({ queryClient })

    useEffect(() => {
        // Function to handle when received new message from other user
        const handleNewMessage = (updatedChatBox: ChatBoxAttributes) => {
            queryClient.invalidateQueries({ queryKey: ['fetch_chatboxes'] });
            setCurrentChatBox(updatedChatBox)
        };
        // Create the listener
        socket.on('new_message', handleNewMessage);
        return () => { socket.off('new_message', handleNewMessage) }
    }, [])
    if (!me || !chatBoxes || isLoading || isLoadingChatBox) return <MessagesSkeleton />

    // Get all the user's friend id whose chatbox is already created
    const partnerIds = new Set(
        chatBoxes.map(box => me.id === box?.user1Id ? box.user2Id : box?.user1Id)
    )
    // Filter out the user's friends who are not in the partnerIds (mean that they dont have a chatbox with the user)
    const friendList = [...me.friendOf, ...me.friends].filter(e => !partnerIds.has(e.id))

    // Function to handle create a newChatBox
    const handleCreateChatBox = (user2Id: string) => {
        createNewChatBoxMutation.mutate({ user1Id: me.id, user2Id })
    }

    // Function to handle send the message by pressing 'Enter'
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
            setMessage('')
        }
    }

    // Function to manage the currentChatBox
    const handleManageCurrentChatBox = (chatbox: ChatBoxAttributes) => {
        setCurrentChatBox(chatbox)
    }

    // Function to handle sending the messages
    const handleSendMessage = () => {
        // Create a message object
        const newMessage = {
            senderId: me.id,
            receiverId: me.id === currentChatBox?.user1Id ? currentChatBox.user2Id : currentChatBox?.user1Id,
            content: message,
            chatBoxId: currentChatBox?.id
        }
        // Emit and create the message to other user
        socket.emit('new_message', newMessage)
    }
    return (
        <div className="w-full h-screen text-white">
            <div className="flex gap-3 max-w-7xl h-full md:p-5 mx-auto flex">
                <div className={`md:flex flex-col md:w-1/3 w-full h-full general-backgroundcolor ${currentChatBox ? 'hidden' : 'block'}`}>
                    <div className="w-full p-2 flex flex-col bg-[#454441]/50 items-center justify-center">
                        <ForwardToInboxIcon />
                        <div className='text-sm font-bold'>Inbox</div>
                    </div>
                    <div className="flex gap-2 w-full p-2 cursor-pointer" onClick={() => setOpenCreateChatBox(!openCreateChatBox)}>
                        <AddIcon />
                        <div className='font-bold'>Create new Inbox</div>
                    </div>
                    {openCreateChatBox && <div className='w-full flex flex-col border-t border-gray-700 p-2'>
                        {friendList.length !== 0 ? friendList.map((e) => {
                            return (
                                <div className='w-full flex gap-2' key={`friend ${e.id}`}>
                                    <div className='flex justify-center items-center w-10 h-10 p-5 bg-gray-300 rounded-lg'>
                                        <Person2 sx={{ color: 'black' }} />
                                    </div>
                                    <div className='w-full flex flex-col'>
                                        <div className='flex justify-between font-bold'>
                                            <div>{e.name}</div>
                                            <div className='cursor-pointer opacity-50 hover:opacity-100' onClick={() => handleCreateChatBox(e.id)}><AddIcon /></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <div className='w-full flex justify-center items-center text-sm opacity-50'>Please create new friend to open more chatbox</div>}
                    </div>}
                    <div className='w-full flex flex-col border-t border-gray-700 p-2 gap-3'>
                        {chatBoxes.map((e) => {
                            return (
                                <div className={`w-full flex gap-2 cursor-pointer hover:opacity-70 ${currentChatBox?.id === e.id && 'opacity-70'}`} key={`Chatbox ${e.id}`} onClick={() => handleManageCurrentChatBox(e)}>
                                    <div className='flex justify-center items-center w-10 h-10 p-5 bg-gray-300 rounded-lg '>
                                        <Person2 sx={{ color: 'black' }} />
                                    </div>
                                    <div className='w-full flex flex-col'>
                                        <div className='flex justify-between font-bold'>
                                            <div>{me.id === e.user1Id ? e.user2?.name : e.user1?.name}</div>
                                            <div className='text-sm opacity-50'>
                                                {e.messages && e.messages.length !== 0 ? dayjs(e.messages[e.messages?.length - 1].createdAt).format('HH:MM') : 'dd:mm:yy'}
                                            </div>
                                        </div>
                                        <div className='text-sm opacity-70'>{e.messages && e.messages.length !== 0 && e.messages[e.messages?.length - 1].content.substring(0, 15)}.......</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {currentChatBox ?
                    <div className="md:w-2/3 w-full max-h-full flex flex-col general-backgroundcolor">
                        <div className="w-full p-2 flex bg-[#454441]/50 items-center justify-between gap-1">

                            <div className='flex flex-col justify-center items-center'>
                                <SmsIcon />
                                <div className='text-sm font-bold'>Talk with {me.id === currentChatBox.user1Id ? currentChatBox.user2?.name : currentChatBox.user1?.name}</div>
                            </div>
                            <div className='' onClick={() => setCurrentChatBox(undefined)}>
                                <DeleteForeverIcon />
                            </div>
                        </div>
                        <div className="flex flex-col h-full max-h-full rounded shadow overflow-y-auto">

                            <div className="flex-1 flex flex-col p-4 text-white">
                                {currentChatBox?.messages?.map((e) => {
                                    return (
                                        <div key={`message ${e.id}`} className={`w-full p-5 border-b border-gray-600 flex flex-col ${e.senderId === me.id ? 'items-end' : 'items-start'}`}>
                                            <div className="text-[12px] font-light opacity-70">
                                                {e.createdAt && dayjs(e.createdAt).format('DD/MM/YY HH:mm:ss')} * {e.senderId === me.id ? currentChatBox.user1?.name : currentChatBox.user2?.name}
                                            </div>
                                            <div className={`min-w-1/4 max-w-1/2 text-white p-2 break-words rounded-xl ${e.senderId === me.id ? 'bg-[#302e2b]' : 'bg-black'}`}>
                                                {e.content}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>


                            <div className="border-t border-gray-700 p-3 ">
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    className="w-full px-4 py-2 bg-[#454441]/50 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-400 placeholder-gray-400"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                    </div> :
                    <div className="md:flex hidden w-2/3 h-full flex flex-col justify-center items-center general-backgroundcolor">
                        <SmsIcon sx={{ fontSize: 60 }} />
                        <div className='font-bold text-2xl'>Choose/Create the ChatBox</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home