import apiClient from "../libs/api";

export const getSpecificUserPuzzles = async () => {
    try {
        const response = await apiClient.get('/user-puzzle/userId');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user puzzles');
    }
}

export const createUserPuzzleRelation = async ({ puzzleId, userId }: { puzzleId: string, userId: string }) => {
    try {
        const response = await apiClient.post('/user-puzzle', { puzzleId, userId })
        return response.data
    } catch (error) {
        throw new Error('Failed to create new user puzzle relation')
    }
}