import { useNotification } from "@/app/contexts/NotificationContext"
import { logout } from "@/app/services/credentials"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Socket } from "socket.io-client"

// Custom hook to create a mutation for logging out
export const useLogout = ({ router, queryClient, socket }: { router: AppRouterInstance, queryClient: QueryClient, socket: Socket | undefined }) => {
    const { showNotification } = useNotification();
    const logoutMutation = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            showNotification('Logout successfully')
            queryClient.invalidateQueries({ queryKey: ['authenticate'] })
            window.location.href = '/login';
        },
        onError: (error) => {
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            showNotification(message);
        }
    })
    return { logoutMutation }
}