"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient()
// Provider to be wrapped in the layout file for the children to be able to use useQuery useMutation
export const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}