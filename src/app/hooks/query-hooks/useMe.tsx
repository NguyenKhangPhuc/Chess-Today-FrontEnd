import { getMe } from "@/app/services/user"
import { ProfileAttributes } from "@/app/types/user"
import { useQuery } from "@tanstack/react-query"

export const useMe = () => {
    const { data: me, isLoading, status } = useQuery<ProfileAttributes>({
        queryKey: ['current_user'],
        queryFn: getMe,

    })

    return { me, isLoading, status }
}