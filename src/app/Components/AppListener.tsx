'use client';
import { useChallengeListener } from "../hooks/socket-hooks/useChallengeListener"
import { useInvitationListener } from "../hooks/socket-hooks/useInvitationListener";
import { useMessageListener } from "../hooks/socket-hooks/useMessageListener";

const AppListener = () => {
    useChallengeListener();
    useInvitationListener();
    useMessageListener();
    return null;
}

export default AppListener