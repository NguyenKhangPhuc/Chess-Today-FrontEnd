'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { ProfileAttributes } from "@/app/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";

// Custom hook to create listener for the invitation receiver
export const useInvitationListener = () => {
    // Get the queryclient to invalidate query
    const queryClient = useQueryClient()
    // Authenticate the user and verify
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();

    useEffect(() => {
        // If the user is not logged in -> return
        if (!authenticationInfo || isError) return
        // Get the socket to handle real-time
        const socket = getSocket();
        // Function to handle when receive an invitation from other user
        const handleReceiveInvitation = (userInfo: ProfileAttributes) => {
            // Alert the user about the invitation sender's name
            alert(`Invitation from ${userInfo.name}`);
            // Invalidate the query
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
        }
        // Listener to listen to the invitations notifications
        socket.on("new_invitations", handleReceiveInvitation);

        return () => {
            socket.off("new_invitations", handleReceiveInvitation);
        };
    }, [authenticationInfo]);
}