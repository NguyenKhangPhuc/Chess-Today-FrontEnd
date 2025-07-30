'use client';
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import LoginIcon from '@mui/icons-material/Login';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import { useToken } from "../contexts/TokenContext";
import { useEffect, useState } from "react";
const NavBar = () => {
    const { token, setToken } = useToken();
    const [mounted, setMounted] = useState(false);
    const handleLogout = () => {
        setToken('')
        window.localStorage.removeItem('userToken');
    }
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <div className="h-screen max-w-40 general-backgroundcolor text-white fixed flex flex-col p-4 gap-5" onClick={() => console.log(token)}>
            <div className="text-2xl font-bold mb-6">ChessToday</div>
            <Link href="/" className="w-full flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <HomeIcon />
                <span>Home</span>
            </Link>

            <Link href="/play-ai" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <SportsEsportsIcon />
                <span>Play</span>
            </Link>

            {token ? <Link href="/friends" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <GroupsIcon />
                <span>Social</span>
            </Link> : <Link href="/login" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <LoginIcon />
                <span>Login</span>
            </Link>}
            {token && <div className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded" onClick={() => handleLogout()}>
                <LoginIcon />
                <span >Logout</span>
            </div>}

            <Link href="/help" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <HelpIcon />
                <span>Help</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-2 hover:bg-[#302e2b] p-2 rounded">
                <SettingsIcon />
                <span>Setting</span>
            </Link>
        </div>
    )
}

export default NavBar;