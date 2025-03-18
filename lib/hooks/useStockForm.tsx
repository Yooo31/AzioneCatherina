import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockSchema, StockFormData } from '@/app/schemas/stockSchema';
import toast from 'react-hot-toast';

export function useStockForm(stock?: StockFormData, userId?: string) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: stock ?? { productName: '', productType: '', quantity: 0 },
  });

  const onSubmit = async (data: StockFormData) => {
    const url = '/api/stock';
    const method = stock ? 'PUT' : 'POST';
    const action = stock ? 'modifié' : 'ajouté';

    const toastId = toast.loading(`${stock ? 'Modification' : 'Ajout'} en cours...`);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, updatedBy: userId, id: stock?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur serveur');
      }

      toast.success(`Stock ${action} avec succès`, { id: toastId });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Une erreur est survenue', { id: toastId });
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    onSubmit,
    open,
    setOpen,
  };
}
