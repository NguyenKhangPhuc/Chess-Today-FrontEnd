'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { ProfileAttributes } from "@/app/types/user";
import { useQueryClient } from "@tanstack/react-query";

export function useInvitationListener() {
    const queryClient = useQueryClient()
    const socket = getSocket();

    useEffect(() => {
        const handleReceiveInvitation = (userInfo: ProfileAttributes) => {
            alert(`Invitation from ${userInfo.name}`);
            queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
        }

        socket.on("new_invitations", handleReceiveInvitation);

        return () => {
            socket.off("new_invitations", handleReceiveInvitation);
        };
    }, []);
}