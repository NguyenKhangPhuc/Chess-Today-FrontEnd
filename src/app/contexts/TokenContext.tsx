'use client';

import { useContext, useState, createContext, useEffect } from "react";

// Type to be passed to the token provider in value
interface TokenContextType {
    token: string;
    setToken: (token: string) => void;
}

// Create the context
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// TokenProvider to passed the token controller to every of its children
export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
    // Get the token out of the local storage
    const [token, setToken] = useState<string>(typeof window !== "undefined" ? localStorage.getItem('userToken') || '' : '');

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
    );
};

// Customer hook to get the token controller from the context
export const useToken = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error("useToken must be used within a TokenProvider");
    }
    return context;
}