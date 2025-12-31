'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useChallenge } from "@/app/contexts/ChallengeContext";
import { useGetAuthentication } from "../query-hooks/useGetAuthentication";

// Custome hook to create a listener to listen to the received challenge from socket
export const useChallengeListener = () => {
    // Manage the route
    const router = useRouter();
    // Verify the user and check if they logged in
    const { authenticationInfo, isLoading, isError } = useGetAuthentication();
    // Get the state from the context to manage the sent challenge
    const { setChallenge } = useChallenge();

    useEffect(() => {
        // If not authenticated -> return
        if (!authenticationInfo || isError) return;
        // If yes -> get the socket
        const socket = getSocket();
        // Function to handle when receive the challenge
        console.log('Set challenge listener')
        const handleReceiveChallenge = (challenge: ChallengeAttributes) => {
            console.log("Received Challenge");
            // Manage the challenge by set the challenge to have the received data and make it visible
            setChallenge({ content: challenge, isOpen: true });
        }
        // Listen to the challenge
        socket.on("new_challenge", handleReceiveChallenge);

        return () => {
            socket.off("new_challenge", handleReceiveChallenge);
        };
    }, [router, authenticationInfo]);
}