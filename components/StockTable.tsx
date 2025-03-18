'use client';

import { useState } from 'react';
import { useStocks } from '@/lib/hooks/useStocks';
import DataTableSkeleton from '@/components/Skeleton/DataTableSkeleton';
import { ErrorCard } from '@/components/ErrorCard';
import { Stock } from '@/types/stock';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockForm } from '@/components/StockForm';
import { stockTypes } from '@/types/stock'; // Assurez-vous que stockTypes est importé

export function StockTable({ userId }: { userId: string }) {
  const { data: stocks, isLoading, error } = useStocks();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Tous');

  if (isLoading) return <DataTableSkeleton />;
  if (error) return <ErrorCard title="Erreur" description="Impossible de charger les stocks" />;

  // Appliquer les filtres de recherche et de type
  const filteredStocks = stocks?.filter((stock) => {
    const matchesSearch =
      stock.productName.toLowerCase().includes(search.toLowerCase()) ||
      stock.productType.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedType === 'Tous' || stock.productType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous</SelectItem>
            {stockTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<Stock>
        columns={[
          { accessorKey: 'productName', header: 'Nom du produit' },
          { accessorKey: 'productType', header: 'Type' },
          { accessorKey: 'quantity', header: 'Quantité' },
          {
            accessorKey: 'updatedAt',
            header: 'Dernière mise à jour',
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
          },
          {
            accessorKey: 'updatedByUser.username',
            header: 'Modifié par',
            cell: ({ row }) => row.original.updatedByUser?.username || 'Inconnu',
          },
          {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => <StockForm stock={row.original} userId={userId} />,
          },
        ]}
        data={filteredStocks || []}
      />
    </div>
  );
}
