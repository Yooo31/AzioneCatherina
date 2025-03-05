import { StockTable } from "@/components/StockTable";

export default function StockPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des stocks</h1>
      <StockTable />
    </main>
  );
}
