import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (!req.url || typeof req.url !== 'string') {
    console.error('⚠️ ERREUR: req.url est invalide:', req.url);
    return NextResponse.next();
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/stocks/:path*', '/menus/:path*'],
};
