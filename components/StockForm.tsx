'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const stockSchema = z.object({
  productName: z.string().min(1, 'Le nom du produit est requis'),
  productType: z.string().min(1, 'Le type de produit est requis'),
  quantity: z.number().int().min(0, 'La quantité doit être positive'),
});

type StockFormProps = {
  stock?: { id: string; productName: string; productType: string; quantity: number };
  userId: string;
};

export function StockForm({ stock, userId }: StockFormProps) {
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

  const onSubmit = async (data: any) => {
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
        console.error('Erreur API :', errorData);
        throw new Error(errorData.error || 'Erreur serveur');
      }

      toast.success(`Stock ${action} avec succès`, { id: toastId });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Erreur :', error);
      toast.error('Une erreur est survenue', { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={stock ? 'outline' : 'default'}>
          {stock ? 'Modifier' : 'Ajouter un stock'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stock ? 'Modifier un stock' : 'Ajouter un stock'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register('productName')} placeholder="Nom du produit" />
          {errors.productName && <p className="text-red-500">{errors.productName.message}</p>}

          <Select
            onValueChange={(value) => setValue('productType', value)}
            defaultValue={watch('productType')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frais">Frais</SelectItem>
              <SelectItem value="Sec">Sec</SelectItem>
              <SelectItem value="Surgelé">Surgelé</SelectItem>
            </SelectContent>
          </Select>
          {errors.productType && <p className="text-red-500">{errors.productType.message}</p>}

          <Input
            {...register('quantity', { valueAsNumber: true })}
            type="number"
            placeholder="Quantité"
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'En cours...' : stock ? 'Modifier' : 'Ajouter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
