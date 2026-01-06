'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useChallenge } from "@/app/contexts/ChallengeContext";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";
import { useNotification } from "@/app/contexts/NotificationContext";
import { ProfileAttributes, UserAttributes, UserBasicAttributes } from "@/app/types/user";
import { useQueryClient } from "@tanstack/react-query";

// Custome hook to create a listener to listen to the received challenge from socket
export const useFriendShipListener = () => {
    // Get the queryclient to invalidate query
    const queryClient = useQueryClient()
    // Verify the user and check if they logged in
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();
    // Manage the notification
    const { showNotification } = useNotification();
    useEffect(() => {
        // If not authenticated -> return
        if (!authenticationInfo || isError) return;
        // If yes -> get the socket
        const socket = getSocket();
        // Function to handle when receive the challenge
        const handleReceiveDeletedFriendShip = (userInfo: UserBasicAttributes | UserAttributes) => {
            // Manage the challenge by set the challenge to have the received data and make it visible
            showNotification(`${userInfo.name} delete friend relationship with you`);
            queryClient.invalidateQueries({ queryKey: ['friendship'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
        // Listen to the challenge
        socket.on("delete_friend", handleReceiveDeletedFriendShip);

        return () => {
            socket.off("delete_friend", handleReceiveDeletedFriendShip);
        };
    }, [authenticationInfo]);
}