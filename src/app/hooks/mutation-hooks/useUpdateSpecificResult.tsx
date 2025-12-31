import { updateGameSpecificResult } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"

// Custom hook to update the specific result
export const useUpdateSpecificResult = () => {
    const updateSpecificResultMutation = useMutation({
        mutationKey: ['update_specific_result'],
        mutationFn: updateGameSpecificResult
    })
    return { updateSpecificResultMutation }
}