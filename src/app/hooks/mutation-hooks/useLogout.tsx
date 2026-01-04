import { logout } from "@/app/services/credentials"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Socket } from "socket.io-client"

// Custom hook to create a mutation for logging out
export const useLogout = ({ router, queryClient, socket }: { router: AppRouterInstance, queryClient: QueryClient, socket: Socket | undefined }) => {
    const logoutMutation = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authenticate'] })
            router.push('/login');
        },
        onError: (error) => {
            let message = 'Unknown error';
            if (error instanceof AxiosError) {
                message = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            alert(`Sign up failed: ${message}`);
        }
    })
    return { logoutMutation }
}