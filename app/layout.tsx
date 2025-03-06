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
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
