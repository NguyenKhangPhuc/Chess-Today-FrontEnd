import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token")
    const { pathname } = req.nextUrl
    const guestOnly = ["/login", "/register"]
    const privateRoutes = ['/game-management', '/profile', '/messages', '/friends', '/puzzles', '/history']

    if (token && guestOnly.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    if (!token && privateRoutes.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/history/:path*', '/chess/:path*', '/game-management', '/profile', '/messages', '/friends', '/login', '/puzzles'],
}