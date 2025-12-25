import { getAuthentication } from "@/app/services/user"
import { useQuery } from "@tanstack/react-query"

export const useGetAuthentication = () => {
    const { data: isAuthenticate, isLoading, isFetching, isError } = useQuery({
        queryKey: ['authenticate'],
        queryFn: getAuthentication,
        retry: false
    })
    return { isAuthenticate, isLoading, isFetching, isError }
}