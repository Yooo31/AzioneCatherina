'use client';

import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { StockForm } from '@/components/StockForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Stock = {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  updatedAt: string;
  updatedByUser?: { username: string } | null;
};

export function StockTable({ userId }: { userId: string }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetch('/api/stock')
      .then((res) => res.json())
      .then((data) => setStocks(data))
      .catch((error) => console.error('Erreur de chargement', error));
  }, []);

  const columns: ColumnDef<Stock>[] = [
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
      cell: ({ row }) => (
        <StockForm stock={row.original} userId={userId} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setFilters((prev) =>
              prev
                .filter((f) => f.id !== 'productName')
                .concat(search ? [{ id: 'productName', value: search }] : []),
            );
          }}
        />

        <Select
          value={selectedType}
          onValueChange={(value) => {
            setSelectedType(value);
            setFilters((prev) =>
              prev
                .filter((f) => f.id !== 'productType')
                .concat(value ? [{ id: 'productType', value }] : []),
            );
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous</SelectItem>
            <SelectItem value="Frais">Frais</SelectItem>
            <SelectItem value="Sec">Sec</SelectItem>
            <SelectItem value="Surgelé">Surgelé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={stocks} filters={filters} />
    </div>
  );
}
