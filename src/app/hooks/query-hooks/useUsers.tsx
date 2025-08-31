import { getUsers } from "@/app/services/user"
import { PaginationAttributes } from "@/app/types/pagination"
import { PageParam } from "@/app/types/types"
import { UserAttributes } from "@/app/types/user"
import { useQuery } from "@tanstack/react-query"

export const useUsers = (cursor: PageParam | undefined) => {
    const { data: users, isLoading } = useQuery<PaginationAttributes<UserAttributes>>({
        queryKey: ['users'],
        queryFn: () => getUsers(cursor?.after, cursor?.before)
    })
    return { users, isLoading }
}