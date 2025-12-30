'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/app/libs/sockets";
import { ChallengeAttributes } from "@/app/types/challenge";

export const useChallengeListener = () => {
    const router = useRouter();
    const socket = getSocket();

    useEffect(() => {
        console.log('Set challenge listener')
        const handleReceiveChallenge = (challenge: ChallengeAttributes) => {
            console.log("Received Challenge");

            const ok = confirm(`New challenge from ${challenge.id}`);

            if (ok) {
                router.push(`/challenge/${challenge.id}`);
            }
        }

        socket.on("new_challenge", handleReceiveChallenge);

        return () => {
            socket.off("new_challenge", handleReceiveChallenge);
        };
    }, [router]);
}