'use client';

import { StockTable } from "@/components/StockTable";
import { StockForm } from "@/components/StockForm";
import { useSession } from "next-auth/react";

export default function StockPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id?.toString() || "";

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des stocks</h1>
        <StockForm userId={userId} />
      </div>
      <StockTable userId={userId} />
    </main>
  );
}
