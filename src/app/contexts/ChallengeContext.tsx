'use client';

import { useContext, useState, createContext, Dispatch, SetStateAction } from "react";
import { ChallengeAttributes } from "../types/challenge";

interface ChallengContextType {
    content: ChallengeAttributes | null
    isOpen: boolean
}

interface ChallengeProviderValueType {
    challenge: ChallengContextType,
    setChallenge: Dispatch<SetStateAction<ChallengContextType>>
}

const ChallengeContext = createContext<ChallengeProviderValueType | undefined>(undefined);

export const ChallengeProvider = ({ children }: { children: React.ReactNode }) => {
    const [challenge, setChallenge] = useState<ChallengContextType>({ content: null, isOpen: false });

    return (
        <ChallengeContext.Provider value={{ challenge, setChallenge }}>
            {children}
        </ChallengeContext.Provider>
    );
};

export const useChallenge = () => {
    const context = useContext(ChallengeContext);
    if (!context) {
        throw new Error("Must be wrapped within the provider");
    }
    return context;
}