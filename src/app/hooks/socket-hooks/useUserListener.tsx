'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";

// Custom hook to manage the listener when the user logged out
export const useUserListener = () => {
    // Manage the route
    const router = useRouter();
    // To verify the user and check if they re logged in
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();


    useEffect(() => {
        // Return if the user is not logged in
        if (!authenticationInfo || isError) return
        // Get the socket to handle real-time
        const socket = getSocket();
        // Function navigate when the user logged out successfully
        const handleLogoutUser = () => {
            router.push('/login')
        }
        // Listener to when user logged out
        socket.on("logout_user", handleLogoutUser);

        return () => {
            socket.off("logout_user", handleLogoutUser);
        };
    }, [router, authenticationInfo]);
}
