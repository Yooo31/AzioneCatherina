'use client';

import { StockTable } from '@/components/StockTable';
import { StockForm } from '@/components/StockForm';
import { useSession } from 'next-auth/react';

export default function StockPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id?.toString() || '';

  const stockTypes = [
    { value: 'alcool', label: 'Alcool', color: '#E5A300' },
    { value: 'soft', label: 'Soft', color: '#1100E5' },
    { value: 'redWine', label: 'Vin rouge', color: '#D40027' },
    { value: 'whiteWine', label: 'Vin blanc', color: '#FFFF8F' },
    { value: 'rWine', label: 'Vin rosé', color: '#FF8FD0' }, //! Ajouter VALUE
    { value: 'rWine', label: 'Surgelé', color: '#27E1F4' }, //! Ajouter VALUE
    { value: 'rWine', label: 'Sec', color: '#43F427' }, //! Ajouter VALUE
    { value: 'rWine', label: 'Ustenciles', color: '#000000' }, //! Ajouter VALUE
  ]

  return (
    <main className="p-6 sm:w-full md:w-3/4 lg:w-3/4 m-auto h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des stocks</h1>
        <StockForm userId={userId} />
      </div>
      <StockTable userId={userId} />

      { stockTypes.map((type) => (
        <div key={type.value} className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full" style={{ backgroundColor: type.color }} />
          <span>{type.label}</span>
        </div>
      ))}
    </main>
  );
}
