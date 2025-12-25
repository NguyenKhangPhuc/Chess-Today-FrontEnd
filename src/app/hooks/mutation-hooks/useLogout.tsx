import { logout } from "@/app/services/credentials"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useLogout = (queryClient: QueryClient) => {
    const logoutMutation = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            console.log('Invalidate query')
            queryClient.invalidateQueries({ queryKey: ['authenticate'] })
        }
    })
    return { logoutMutation }
}