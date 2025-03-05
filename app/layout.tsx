'use client';

import { Session } from 'next-auth';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session?: Session;
}>) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
