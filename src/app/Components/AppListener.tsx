'use client';
import { useChallengeListener } from "../hooks/socket-hooks/useChallengeListener"
import { useInvitationListener } from "../hooks/socket-hooks/useInvitationListener";
import { useMessageListener } from "../hooks/socket-hooks/useMessageListener";
import { useUserListener } from "../hooks/socket-hooks/useUserListener";

// Component to set up global socket listener
const AppListener = () => {
    // Listen to challenge notification
    useChallengeListener();
    // Listen to invitation notification
    useInvitationListener();
    // Listen to message notification
    useMessageListener();
    // Listen to user login/logout
    useUserListener();
    return null;
}

export default AppListener