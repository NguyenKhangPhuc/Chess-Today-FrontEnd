'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { ProfileAttributes, UserBasicAttributes } from "@/app/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";
import { useNotification } from "@/app/contexts/NotificationContext";
import { userInfo } from "os";

// Custom hook to create listener for the invitation receiver
export const useInvitationListener = () => {
    // Get the queryclient to invalidate query
    const queryClient = useQueryClient()
    // Authenticate the user and verify
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();
    const { showNotification } = useNotification();

    useEffect(() => {
        // If the user is not logged in -> return
        if (!authenticationInfo || isError) return
        // Get the socket to handle real-time
        const socket = getSocket();
        // Function to handle when receive an invitation from other user
        const handleReceiveInvitation = (userInfo: ProfileAttributes) => {
            // Alert the user about the invitation sender's name
            showNotification(`Invitation from ${userInfo.name}`)
            // Invalidate the query
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
        }

        const handleAnnounceAcceptedInvitation = (userInfo: UserBasicAttributes) => {
            // Alert the user about the accepted invitation sender's name
            showNotification(`${userInfo.name} has become your friend`)
            // Invalidate the query
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
            queryClient.invalidateQueries({ queryKey: ['sent_invitations'] });
            queryClient.invalidateQueries({ queryKey: ['friendship'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }

        const handleAnnounceDeclineInvitation = (userInfo: UserBasicAttributes) => {
            // Alert the user about the decline invitation sender's name
            showNotification(`${userInfo.name} delete the invitation`)
            // Invalidate the query
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
            queryClient.invalidateQueries({ queryKey: ['sent_invitations'] });
        }
        // Listener to listen to the invitations notifications
        socket.on("new_invitations", handleReceiveInvitation);
        socket.on("accept_invitation", handleAnnounceAcceptedInvitation);
        socket.on("decline_invitation", handleAnnounceDeclineInvitation);


        return () => {
            socket.off("new_invitations", handleReceiveInvitation);
        };
    }, [authenticationInfo]);
}