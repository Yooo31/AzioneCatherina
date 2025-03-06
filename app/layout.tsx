'use client';

import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider session={session}>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
