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
const NavBar = () => {
    const queryClient = useQueryClient();

    const { authenticationInfo, isLoading, isFetching, isError } = useGetAuthentication();
    const router = useRouter();
    const { logoutMutation } = useLogout({ router: router, queryClient: queryClient });
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
            {!isError && <div className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded" onClick={() => handleLogout()}>
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