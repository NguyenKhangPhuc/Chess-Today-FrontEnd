import { EngineScore } from "../Components/Chessboard";
import apiClient from "../libs/api";
import { GAME_TYPE, GameMessagesAttributes, LoginAttributes, MessageAttributes, MoveAttributes, SignUpAttributes } from "../types/types";

export const signUp = async (data: SignUpAttributes) => {
    try {
        const response = await apiClient.post('/sign-up', data);
        return response.data;
    } catch (error) {
        throw new Error('Sign up failed');
    }
}


export const login = async (data: LoginAttributes) => {
    try {
        const response = await apiClient.post('/login', data);
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
}


export const friendship = async (friendId: string) => {
    try {
        const response = await apiClient.post('/friendship', { friendId });
        return response.data;
    } catch (error) {
        throw new Error('Friendship request failed');
    }
}

export const getGame = async (gameId: string) => {
    try {
        const response = await apiClient.get(`/game/${gameId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch game data');
    }
}


export const getMe = async () => {
    try {
        const response = await apiClient.get(`/user`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch current user data');
    }
}


export const getUsers = async (after: string | undefined, before: string | undefined) => {
    try {
        const response = await apiClient.get(`/user/people?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch all users')
    }
}

export const sendInvitation = async (receiverId: string) => {
    try {
        const response = await apiClient.post('/invite', { receiverId })
        return response.data
    } catch (error) {
        throw new Error('Failed to send invitations')
    }
}

export const deleteSentInvitation = async (invitationId: string) => {
    try {
        await apiClient.delete(`/invite/${invitationId}`)
    } catch (error) {
        throw new Error('Failed to delete the invitation')
    }
}

export const acceptInvitation = async ({ invitationId, friendId }: { invitationId: string, friendId: string }) => {
    try {
        const response = await apiClient.post('/friendship', { friendId })
        await deleteSentInvitation(invitationId);
        return response.data
    } catch (error) {
        throw new Error('Failed to delete the invitation')
    }
}

export const updateTime = async ({ newTimeLeft, gameId }: { newTimeLeft: number, gameId: string }) => {
    try {
        const response = await apiClient.put(`/game/${gameId}`, { newTimeLeft })
        return response.data
    } catch (error) {
        throw new Error('Failed to update time')
    }
}

export const getGameMessages = async (gameId: string) => {
    try {
        const response = await apiClient.get(`/game-messages/${gameId}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch the messages')
    }
}

export const createGameMessages = async (gameMessages: GameMessagesAttributes) => {
    try {
        const response = await apiClient.post('/game-messages', gameMessages)
        return response.data
    } catch (error) {
        throw new Error('Failed to create new game message')
    }
}

export const getGameMoves = async (gameId: string) => {
    try {
        const response = await apiClient.post('/move/game', { gameId })
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch game moves')
    }
}

export const createNewGameMoves = async (newMove: MoveAttributes) => {
    try {
        const response = await apiClient.post('/move', newMove)
        return response.data
    } catch (error) {
        throw new Error('Failed to create new move')
    }
}

export const updateGameDrawResult = async (gameId: string) => {
    try {
        const response = await apiClient.put(`/game/${gameId}/draw`)
        return response.data
    } catch (error) {
        throw new Error('Failed to update game draw result')
    }
}

export const updateGameSpecificResult = async ({ gameId, winnerId, loserId }: { gameId: string, winnerId: string, loserId: string }) => {
    try {
        const response = await apiClient.put(`/game/${gameId}/specific-result`, { winnerId, loserId })
        return response.data
    } catch (error) {
        throw new Error('Failed to update game draw result')
    }
}


export const deleteFriendShip = async (friendshipId: string) => {
    try {
        const response = await apiClient.delete(`/friendship/${friendshipId}`);
        return response.data
    } catch (error) {
        throw new Error('Failed to delete friendship')
    }
}

export const getChatBox = async () => {
    try {
        const response = await apiClient.get('/chatbox')
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch chatbox')
    }
}

export const createChatBox = async ({ user1Id, user2Id }: { user1Id: string, user2Id: string }) => {
    try {
        const response = await apiClient.post('/chatbox', { user1Id, user2Id })
        return response.data
    } catch (error) {
        throw new Error('Failed to create new chatbox')
    }
}

export const createMessage = async (message: MessageAttributes) => {
    try {
        const response = await apiClient.post('/message', message)
        return response.data
    } catch (error) {
        throw new Error('Failed to create new message')
    }
}

export const updateElo = async ({ gameType, userElo }: { gameType: GAME_TYPE, userElo: number }) => {
    try {
        const response = await apiClient.put('/user/update-elo', { gameType, userElo })
        return response.data
    } catch (error) {
        throw new Error('Failed to update user elo')
    }
}


export const getUserGame = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    console.log(userId)
    if (userId == undefined) return []
    try {
        const response = await apiClient.get(`/game/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''} `)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch users games')
    }
}

export const getUserFriend = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    if (!userId) return []
    try {
        const response = await apiClient.get(`/friendship/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch user friends ')
    }
}

export const getSentInvitation = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    if (!userId) return []
    try {
        const response = await apiClient.get(`/invite/sender/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to get sent invitations')
    }
}

export const getMyInvitations = async (userId: string | undefined, after: string | undefined, before: string | undefined) => {
    if (!userId) return []
    try {
        const response = await apiClient.get(`/invite/receiver/user/${userId}?limit=5${after ? `&after=${after}` : ''}${before ? `&before=${before}` : ''}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to get sent invitations')
    }
}


export const createBotGame = async (type: string) => {
    try {
        const response = await apiClient.post('/game/bot', { type })
        return response.data
    } catch (error) {
        throw new Error('Failed to create bot game')
    }
}

export const botMakeMove = async (fen: string) => {
    try {
        const response = await apiClient.post('/analyze', { fen })
        return response.data
    } catch (error) {
        throw new Error('Failed to request for a bot move')
    }
}


export const updateGameFen = async ({ gameId, fen }: { gameId: string, fen: string }) => {
    try {
        const response = await apiClient.put(`/game/fen/${gameId}`, { fen })
        return response.data
    } catch (error) {
        throw new Error('Failed to update game fen')
    }
}

export const getFeedBack = async ({ move, beforeFen, score }: { move: string, beforeFen: string, score: EngineScore | null }) => {
    try {
        const response = await apiClient.post('/analyze/explanation', { move, beforeFen, score })
        return response.data
    } catch (error) {
        throw new Error('Failed to get explanation for the move')
    }
}