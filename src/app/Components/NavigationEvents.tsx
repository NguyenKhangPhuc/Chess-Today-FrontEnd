'use client'

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react";
import { useChallenge } from "../contexts/ChallengeContext";


export const NavigationEvents = ({ handleLeaveChallengePage }: { handleLeaveChallengePage: (challengeId: string) => void }) => {
    // Get the current path name
    const pathname = usePathname();
    // To store the previous path to compare
    const prevPathRef = useRef(pathname);
    const { setChallenge } = useChallenge()
    useEffect(() => {
        console.log(pathname, prevPathRef.current)
        // Regex to know if it is the challenge page
        const challengeRegex = /^\/challenge\/([^\/\?]+)(\/.*)?$/;
        // Check if the previous path match the regex
        const prevMatch = prevPathRef.current.match(challengeRegex);
        // Check if the current path match the regex
        const currentMatch = pathname.match(challengeRegex);
        // If prev path match and curr path not -> leave the challenge page
        console.log('current match', currentMatch, 'prev match', prevMatch)
        if (!currentMatch && prevMatch) {
            setChallenge({ content: null, isOpen: false })
            console.log('Call the function', prevMatch[1])
            // Call the function
            handleLeaveChallengePage(prevMatch[1]);
        }
        // Set the prev path to be the current path
        prevPathRef.current = pathname
    }, [pathname])
    return null;
}