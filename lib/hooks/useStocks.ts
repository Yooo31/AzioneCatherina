import { Stock } from '@/types/stock';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchStocks = async (): Promise<Stock[]> => {
  const res = await fetch('/api/stock');
  if (!res.ok) throw new Error('Erreur lors du chargement des stocks');
  return res.json();
};

export function useStocks() {
  return useQuery({ queryKey: ['stocks'], queryFn: fetchStocks });
}

export function useMutateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stock: Partial<Stock>) => {
      const method = stock.id ? 'PUT' : 'POST';
      const res = await fetch('/api/stock', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stock),
      });

      if (!res.ok) throw new Error('Erreur lors de l’enregistrement');

      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stocks'] }),
  });
}
