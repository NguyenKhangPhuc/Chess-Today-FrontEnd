import { getSpecificUserInfo } from "@/app/services/user"
import { ProfileAttributes } from "@/app/types/user"
import { useQuery } from "@tanstack/react-query"

export const useGetSpecificUserInfo = (id: string) => {
    const { data: userInfo, isLoading } = useQuery<ProfileAttributes>({
        queryKey: ['user_info', id],
        queryFn: () => getSpecificUserInfo(id),
    })
    return { userInfo, isLoading }
}