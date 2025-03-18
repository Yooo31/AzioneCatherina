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
      <body className="w-screen h-screen bg-gray-100 sm:pt-0 md:pt-12 lg:pt-12">
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
