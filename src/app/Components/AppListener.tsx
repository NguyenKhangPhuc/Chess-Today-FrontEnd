'use client';
import { useChallengeListener } from "../hooks/socket-hooks/useChallengeListener"

const AppListener = () => {
    useChallengeListener();
    return null;
}

export default AppListener