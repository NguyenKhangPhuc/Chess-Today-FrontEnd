'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ProfileAttributes } from "@/app/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";

// Custom hook to create listener for the message
export const useMessageListener = () => {
    // Get the query client to invalidate/refetch query
    const queryClient = useQueryClient()
    // Get the current route
    const pathname = usePathname()
    // Verify the user if he is logged in
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();

    useEffect(() => {
        // If the user is not logged in, return
        if (!authenticationInfo || isError) return
        // Get the socket to handle real-time messages noti
        const socket = getSocket();
        // If they are already in the /messages route then dont need to announce them
        if (pathname.startsWith('/messages')) return
        // Function to handle the received message notification
        const handleReceiveInvitation = (userInfo: ProfileAttributes) => {
            alert(`Message from ${userInfo.name}`);
            queryClient.invalidateQueries({ queryKey: ['fetch_chatboxes'] });
        }
        // Listener to the messages
        socket.on("new_messages_outside", handleReceiveInvitation);

        return () => {
            socket.off("new_messages_outside", handleReceiveInvitation);
        };
    }, [pathname, authenticationInfo]);
}