import { updateElo } from "@/app/services/user"
import { QueryClient, useMutation } from "@tanstack/react-query"

// Custom hook to update the user elo
export const useUpdateElo = ({ queryClient, id }: { queryClient: QueryClient, id: string }) => {
    const updateEloMutation = useMutation({
        mutationKey: ['update_elo'],
        mutationFn: updateElo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`current_user`] })
            queryClient.invalidateQueries({ queryKey: [`game ${id}`] })
        },
        onError: (error: unknown) => {
            console.log('Error', error)
        }
    })
    return { updateEloMutation }
}