'use client';
import { useChallengeListener } from "../hooks/socket-hooks/useChallengeListener"
import { useInvitationListener } from "../hooks/socket-hooks/useInvitationListener";
import { useMessageListener } from "../hooks/socket-hooks/useMessageListener";

// Component to set up global socket listener
const AppListener = () => {
    // Listen to challenge notification
    useChallengeListener();
    // Listen to invitation notification
    useInvitationListener();
    // Listen to message notification
    useMessageListener();
    return null;
}

export default AppListener