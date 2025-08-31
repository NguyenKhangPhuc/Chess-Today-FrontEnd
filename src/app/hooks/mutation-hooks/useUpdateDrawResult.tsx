import { updateGameDrawResult } from "@/app/services/game"
import { useMutation } from "@tanstack/react-query"

export const useUpdateDrawResult = () => {
    const updateDrawResultMutation = useMutation({
        mutationKey: ['update_draw_result'],
        mutationFn: updateGameDrawResult
    })
    return { updateDrawResultMutation }
}