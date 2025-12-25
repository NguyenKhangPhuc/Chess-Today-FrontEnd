import { getAuthentication } from "@/app/services/user"
import { useQuery } from "@tanstack/react-query"

export const useGetAuthentication = () => {
    const { data: isAuthenticate, isLoading, status } = useQuery({
        queryKey: ['authenticate'],
        queryFn: getAuthentication
    })
    return { isAuthenticate, isLoading, status }
}