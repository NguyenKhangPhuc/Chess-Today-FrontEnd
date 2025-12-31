'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ProfileAttributes } from "@/app/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";

export const useMessageListener = () => {
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();

    useEffect(() => {
        if (!authenticationInfo || isError) return
        const socket = getSocket();
        if (pathname.startsWith('/messages')) return
        const handleReceiveInvitation = (userInfo: ProfileAttributes) => {
            alert(`Message from ${userInfo.name}`);
            queryClient.invalidateQueries({ queryKey: ['fetch_chatboxes'] });
        }

        socket.on("new_messages_outside", handleReceiveInvitation);

        return () => {
            socket.off("new_messages_outside", handleReceiveInvitation);
        };
    }, [pathname, authenticationInfo]);
}