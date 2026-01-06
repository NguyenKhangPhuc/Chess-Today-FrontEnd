import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar, { NavBarMobile } from "./Components/NavBar";
import { TanstackProvider } from "./providers/tanstackProvider";
import AppListener from "./Components/AppListener";
import { NavigationEvents } from "./Components/NavigationEvents";
import { handleLeaveChallengePage } from "./challenge/[challengeId]/page";
import { ChallengeProvider } from "./contexts/ChallengeContext";
import ChallengeNotification from "./Components/ChallengeNotification";
import { NavbarProvider } from "./contexts/NavBarContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationCard from "./Components/NotificationCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChessToday",
  description: "Play online Chess",
  icons: {
    icon: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        suppressHydrationWarning={true}
      >
        <ChallengeProvider>
          <NavbarProvider>
            <NotificationProvider>
              <TanstackProvider>
                <NavigationEvents handleLeaveChallengePage={handleLeaveChallengePage} />
                <AppListener />
                <div className="sm:block hidden"><NavBar /></div>
                <div className="sm:hidden block"><NavBarMobile /></div>
                <ChallengeNotification />
                <NotificationCard />
                <main className="sm:ml-40 m-0 bg-[#302e2b] sm:pt-0 pt-10">{children}</main>
              </TanstackProvider>
            </NotificationProvider>
          </NavbarProvider>
        </ChallengeProvider>
      </body>
    </html>
  );
}
