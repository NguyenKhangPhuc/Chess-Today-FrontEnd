'use client'
import { useRouter } from "next/navigation";
import { useChallenge } from "../contexts/ChallengeContext"


// The UI and function of the challenge notification that will be sent to other player
const ChallengeNotification = () => {
    // Get the information of the challenge
    const { challenge, setChallenge } = useChallenge();
    // Manage the route
    const router = useRouter();
    // Only show the notification if isOpen is true

    // Decline the challenge, set the content to null, set the isOpen to false to close the notification
    const handleDeclineChallenge = () => {
        setChallenge({ content: null, isOpen: false })
    }

    // Accept the challenge, set the content to null, close the notification and move the user to the challenge waiting page
    const handleAcceptChallenge = () => {
        setChallenge({ content: null, isOpen: false })
        router.push(`/challenge/${challenge.content?.id}`);
    }

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${challenge.isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"}`}>
            <div className="bg-[#262522] text-white rounded-lg px-8 py-4 shadow-lg min-w-[350px]">

                <div className="mb-3">
                    <p className="text-sm text-gray-400">Challenge from</p>
                    <p className="text-lg font-semibold">{challenge.content?.sender?.name}</p>
                </div>

                <div className="mb-4 text-sm space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Game</span>
                        <span>{challenge.content?.gameType}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Your side</span>
                        <span className="font-medium text-yellow-400">{challenge.content?.isSenderPlayer1 ? 'Black' : 'White'}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 bg-[#ab8a2e] hover:opacity-90 text-white py-2 rounded-md font-medium" onClick={() => handleDeclineChallenge()}>
                        Decline
                    </button>
                    <button className="flex-1 bg-[#6e3410] hover:opacity-90 text-white py-2 rounded-md font-medium" onClick={() => handleAcceptChallenge()}>
                        Accept
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ChallengeNotification