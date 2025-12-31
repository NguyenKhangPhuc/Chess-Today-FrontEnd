'use client';

import { useContext, useState, createContext, Dispatch, SetStateAction } from "react";
import { ChallengeAttributes } from "../types/challenge";
// The type of the challengeNotification controlle
interface ChallengContextType {
    content: ChallengeAttributes | null
    isOpen: boolean
}

// The type to be passed in the Challenge notification (in value)
interface ChallengeProviderValueType {
    challenge: ChallengContextType,
    setChallenge: Dispatch<SetStateAction<ChallengContextType>>
}

// Create the context
const ChallengeContext = createContext<ChallengeProviderValueType | undefined>(undefined);

// Create the provider and pass the challenge controller to every child in provider
export const ChallengeProvider = ({ children }: { children: React.ReactNode }) => {
    // Challenge controller
    const [challenge, setChallenge] = useState<ChallengContextType>({ content: null, isOpen: false });

    return (
        <ChallengeContext.Provider value={{ challenge, setChallenge }}>
            {children}
        </ChallengeContext.Provider>
    );
};
// Custom hook to get the challenge controller from the context
export const useChallenge = () => {
    const context = useContext(ChallengeContext);
    if (!context) {
        throw new Error("Must be wrapped within the provider");
    }
    return context;
}