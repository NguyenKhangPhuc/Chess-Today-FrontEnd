import { getAuthentication } from "@/app/services/user"
import { UserBasicAttributes } from "@/app/types/user"
import { useQuery } from "@tanstack/react-query"

// Custom hook to get the user basic information
export const useGetAuthentication = () => {
    const { data: authenticationInfo, isLoading, isFetching, isError } = useQuery<{ userInfo: UserBasicAttributes }>({
        queryKey: ['authenticate'],
        queryFn: getAuthentication,
        retry: false
    })
    return { authenticationInfo, isLoading, isFetching, isError }
}