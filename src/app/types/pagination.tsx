export interface PaginationAttributes<T> {
    data: Array<T>,
    hasNextPage: boolean | undefined,
    hasPrevPage: boolean | undefined,
    nextCursor: string | undefined,
    prevCursor: string | undefined
}
