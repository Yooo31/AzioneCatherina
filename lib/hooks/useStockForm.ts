import { Stock } from '@/types/stock';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useMutateStock } from './useStocks';

const stockSchema = z.object({
  productName: z.string().min(1, 'Le nom du produit est requis'),
  productType: z.string().min(1, 'Le type de produit est requis'),
  quantity: z.number().int().min(0, 'La quantité doit être positive'),
});

export function useStockForm(stock?: Stock, userId?: string) {
  const router = useRouter();
  const { mutate, isPending } = useMutateStock();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: stock ?? { productName: '', productType: '', quantity: 0 },
  });

  const onSubmit = async (data: Partial<Stock>) => {
    mutate(
      { ...data, updatedBy: userId, id: stock?.id },
      {
        onSuccess: () => {
          toast.success(`Stock ${stock ? 'modifié' : 'ajouté'} avec succès`);
          router.refresh();
        },
        onError: () => toast.error('Une erreur est survenue'),
      }
    );
  };

  return { register, handleSubmit, setValue, watch, errors, isPending, onSubmit };
}
