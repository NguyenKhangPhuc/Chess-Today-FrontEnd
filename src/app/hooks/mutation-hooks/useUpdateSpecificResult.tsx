import { updateGameSpecificResult } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"

export const useUpdateSpecificResult = () => {
    const updateSpecificResultMutation = useMutation({
        mutationKey: ['update_specific_result'],
        mutationFn: updateGameSpecificResult
    })
    return { updateSpecificResultMutation }
}