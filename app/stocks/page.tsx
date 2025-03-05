"use client";

import { useSession } from "next-auth/react";

export default function Stocks() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <p>Utilisateur connecté : {session.user?.name}</p>
      ) : (
        <p>Pas connecté</p>
      )}
    </div>
  );
}
