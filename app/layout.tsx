'use client';

import { Toaster } from 'react-hot-toast';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session?: any;
}>) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider session={session}>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
