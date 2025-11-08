import apiClient from "../libs/api";
import { PuzzleAttributes } from "../types/puzzles";


export const getPuzzles = async () => {
    try {
        const response = await apiClient.get<Array<PuzzleAttributes>>('/puzzles');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch puzzles')
    }
}