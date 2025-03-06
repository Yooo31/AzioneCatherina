'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.toString() || '';
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-6">Bienvenue {capitalizedUserName}</h1>
        <p className="text-lg text-center mb-8 text-gray-600">
          Explorez nos options et gérez vos stocks et menus facilement.
        </p>
        <div className="space-y-4">
          <Link
            href="/stocks"
            className="block text-center text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Voir les stocks
          </Link>
          <Link
            href="/menu"
            className="block text-center text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Voir les idées de menu
          </Link>
        </div>
      </div>
    </div>
  );
}
