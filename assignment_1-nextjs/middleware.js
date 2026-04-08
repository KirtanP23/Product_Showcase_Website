import { NextResponse } from 'next/server';

export function middleware(req) {
    // Middleware simplified - authentication handled in API routes directly
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/posts/:path*'],
};
