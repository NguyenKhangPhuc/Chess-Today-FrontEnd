import { logout } from "@/app/services/credentials"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const useLogout = ({ router, queryClient }: { router: AppRouterInstance, queryClient: QueryClient }) => {
    const logoutMutation = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            console.log('Invalidate query')
            queryClient.invalidateQueries({ queryKey: ['authenticate'] })
            router.replace('/login')
        }
    })
    return { logoutMutation }
}