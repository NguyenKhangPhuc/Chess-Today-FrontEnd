import { getSpecificUserInfo } from "@/app/services/user"
import { ProfileAttributes } from "@/app/types/user"
import { useQuery } from "@tanstack/react-query"

// Custom hooks to get the user information based on their id
export const useGetSpecificUserInfo = (id: string) => {
    const { data: userInfo, isLoading } = useQuery<ProfileAttributes>({
        queryKey: ['user_info', id],
        queryFn: () => getSpecificUserInfo(id),
    })
    return { userInfo, isLoading }
}