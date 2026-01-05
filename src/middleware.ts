import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;
    const protectedRoutes = ['/game-management', '/profile', '/messages', '/friends', '/puzzles', '/history']

    if (pathname == '/login') {
        const token = request.cookies.get("access_token");
        if (token) {

            return NextResponse.redirect(new URL("/game-management", request.url));

        }
    }

    if (protectedRoutes.some(route => pathname.startsWith(route))) {

        const token = request.cookies.get("access_token");

        if (!token) {

            return NextResponse.redirect(new URL("/login", request.url));

        }

    }

    return NextResponse.next();

}

export const config = {
    matcher: ['/history/:path*', '/chess/:path*', '/game-management', '/profile', '/messages', '/friends', '/login', '/puzzles'],
}