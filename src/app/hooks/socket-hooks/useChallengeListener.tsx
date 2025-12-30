'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";
import { useChallenge } from "@/app/contexts/ChallengeContext";

export const useChallengeListener = () => {
    const router = useRouter();
    const socket = getSocket();
    const { setChallenge } = useChallenge();

    useEffect(() => {
        console.log('Set challenge listener')
        const handleReceiveChallenge = (challenge: ChallengeAttributes) => {
            console.log("Received Challenge");
            setChallenge({ content: challenge, isOpen: true });
        }

        socket.on("new_challenge", handleReceiveChallenge);

        return () => {
            socket.off("new_challenge", handleReceiveChallenge);
        };
    }, [router]);
}