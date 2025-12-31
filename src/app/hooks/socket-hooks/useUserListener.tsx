'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";

export const useUserListener = () => {
    const router = useRouter();
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();


    useEffect(() => {
        if (!authenticationInfo || isError) return
        const socket = getSocket();

        const handleLogoutUser = () => {
            router.push('/login')
        }
        socket.on("logout_user", handleLogoutUser);

        return () => {
            socket.off("logout_user", handleLogoutUser);
        };
    }, [router, authenticationInfo]);
}
