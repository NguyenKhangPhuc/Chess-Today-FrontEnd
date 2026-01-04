'use client';

import { useContext, useState, createContext, Dispatch, SetStateAction } from "react";
// The type of the challengeNotification controlle

// The type to be passed in the Challenge notification (in value)
interface NavBarProviderValueType {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

// Create the context
const NavBarContext = createContext<NavBarProviderValueType | undefined>(undefined);

// Create the provider and pass the challenge controller to every child in provider
export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
    // Navbar on/off state controller
    const [isOpen, setIsOpen] = useState(false);

    return (
        <NavBarContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </NavBarContext.Provider>
    );
};
// Custom hook to get the challenge controller from the context
export const useNavBarState = () => {
    const context = useContext(NavBarContext);
    if (!context) {
        throw new Error("Must be wrapped within the provider");
    }
    return context;
}