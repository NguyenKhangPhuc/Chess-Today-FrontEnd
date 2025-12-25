// middleware.ts (ROOT)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/history/:path*', '/chess/:path*', '/game-management', '/profile', '/messages', '/friends'],
}