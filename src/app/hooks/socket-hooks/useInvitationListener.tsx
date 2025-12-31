'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { ProfileAttributes } from "@/app/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";

export const useInvitationListener = () => {
    const queryClient = useQueryClient()
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();

    useEffect(() => {
        if (!authenticationInfo || isError) return
        const socket = getSocket();
        const handleReceiveInvitation = (userInfo: ProfileAttributes) => {
            alert(`Invitation from ${userInfo.name}`);
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
        }

        socket.on("new_invitations", handleReceiveInvitation);

        return () => {
            socket.off("new_invitations", handleReceiveInvitation);
        };
    }, [authenticationInfo]);
}