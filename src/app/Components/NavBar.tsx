'use client';
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import LoginIcon from '@mui/icons-material/Login';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import MessageIcon from '@mui/icons-material/Message';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useRouter } from "next/navigation";
import { useLogout } from "../hooks/mutation-hooks/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAuthentication } from "../hooks/query-hooks/useGetAuthentication";
import NavBarSkeleton from "./NavBarSkeleton";
import { getSocket } from "../libs/sockets";
import { useNavBarState } from "../contexts/NavBarContext";

const HamburgerIcon = () => {
    const { isOpen, setIsOpen } = useNavBarState();
    return (
        <label className="hamburger">
            <input type="checkbox"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)} />
            <svg viewBox="0 0 32 32">
                <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                <path className="line" d="M7 16 27 16"></path>
            </svg>
        </label>
    )
}

export const NavBarMobile = () => {
    const { isOpen, setIsOpen } = useNavBarState();
    // query client to invalidate query which get the user basic info after logged out
    const queryClient = useQueryClient();
    // Get the user basic information
    const { authenticationInfo, isLoading, isFetching, isError } = useGetAuthentication();
    // Manage the route
    const router = useRouter();
    const { logoutMutation } = useLogout({ router: router, queryClient: queryClient, socket: isError || !authenticationInfo ? undefined : getSocket() });
    // Function to handle log out
    const handleLogout = () => {
        logoutMutation.mutate();
        setIsOpen(false)
    }
    console.log(isOpen)
    if (isLoading || isFetching) return <NavBarSkeleton />;
    return (
        <div>
            <div className="fixed top-0 left-0 z-50 cursor-pointer"><HamburgerIcon /></div>
            {isOpen && <div className="h-screen w-full general-backgroundcolor text-white fixed flex flex-col  gap-5 z-10">
                <div className="sm:block hidden text-2xl  font-bold mb-6">ChessToday</div>
                <Link href="/" className=" flex items-center space-x-2 hover:bg-[#302e2b] p-2 mt-15 border-b border-gray-500" onClick={() => setIsOpen(false)}>
                    <HomeIcon />
                    <span className="block ">Home</span>
                </Link>
                {!isError && <Link href={`/profile/${authenticationInfo?.userInfo.id}`} className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 border-b border-gray-500 " onClick={() => setIsOpen(false)}>
                    <AccountBoxIcon />
                    <span className="block">Profile</span>
                </Link>}
                {!isError ? <Link href="/friends" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 border-b border-gray-500" onClick={() => setIsOpen(false)}>
                    <GroupsIcon />
                    <span className="block ">Social</span>
                </Link> : <Link href="/login" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 border-b border-gray-500" onClick={() => setIsOpen(false)}>
                    <LoginIcon />
                    <span className="block">Login</span>
                </Link>}
                {!isError && <Link href="/messages" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 border-b border-gray-500" onClick={() => setIsOpen(false)}>
                    <MessageIcon />
                    <span className="block ">Message</span>
                </Link>}
                {!isError && <div className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 border-b border-gray-500 cursor-pointer" onClick={() => handleLogout()}>
                    <LoginIcon />
                    <span className="block">Logout</span>
                </div>}

                <Link href="/" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 border-b border-gray-500" onClick={() => setIsOpen(false)}>
                    <HelpIcon />
                    <span className="block ">Help</span>
                </Link>
                <Link href="/" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 border-b border-gray-500" onClick={() => setIsOpen(false)}>
                    <SettingsIcon />
                    <span className="block">Setting</span>
                </Link>
            </div>}
        </div>
    )
}

// Navbar of the application
const NavBar = () => {
    // query client to invalidate query which get the user basic info after logged out
    const queryClient = useQueryClient();
    // Get the user basic information
    const { authenticationInfo, isLoading, isFetching, isError } = useGetAuthentication();
    // Manage the route
    const router = useRouter();
    const { logoutMutation } = useLogout({ router: router, queryClient: queryClient, socket: isError || !authenticationInfo ? undefined : getSocket() });
    // Function to handle log out
    const handleLogout = () => {
        logoutMutation.mutate();
    }
    console.log(authenticationInfo)
    if (isLoading || isFetching) return <NavBarSkeleton />;
    return (
        <div className="h-screen max-w-10 sm:max-w-40 general-backgroundcolor text-white fixed flex flex-col sm:p-4 gap-5">
            <div className="sm:block hidden text-2xl  font-bold mb-6">ChessToday</div>
            <Link href="/" className=" flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <HomeIcon />
                <span className="sm:block hidden">Home</span>
            </Link>
            {!isError && <Link href={`/profile/${authenticationInfo?.userInfo.id}`} className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded" >
                <AccountBoxIcon />
                <span className="sm:block hidden">Profile</span>
            </Link>}
            {!isError ? <Link href="/friends" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <GroupsIcon />
                <span className="sm:block hidden">Social</span>
            </Link> : <Link href="/login" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <LoginIcon />
                <span className="sm:block hidden">Login</span>
            </Link>}
            {!isError && <Link href="/messages" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded" >
                <MessageIcon />
                <span className="sm:block hidden">Message</span>
            </Link>}
            {!isError && <div className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded cursor-pointer" onClick={() => handleLogout()}>
                <LoginIcon />
                <span className="sm:block hidden">Logout</span>
            </div>}

            <Link href="/" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <HelpIcon />
                <span className="sm:block hidden">Help</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <SettingsIcon />
                <span className="sm:block hidden">Setting</span>
            </Link>
        </div>
    )
}

export default NavBar;