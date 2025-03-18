import { useEffect, useState } from 'react';

export type Stock = {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  updatedAt: string;
  updatedByUser?: { username: string } | null;
};

export function useStock() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/stock')
      .then((res) => res.json())
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur de chargement', error);
        setError(true);
        setLoading(false);
      });
  }, []);

  return { stocks, loading, error };
}
