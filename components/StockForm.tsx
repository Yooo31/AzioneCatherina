import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StockTypeSelect } from '@/components/StockTypeSelect'
import { StockFormData } from '@/app/schemas/stockSchema';;
import { useStockForm } from '@/lib/hooks/useStockForm';

interface StockFormProps {
  stock?: StockFormData;
  userId?: string;
}


export function StockForm({ stock, userId }: StockFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    onSubmit,
    open,
    setOpen,
  } = useStockForm(stock, userId);

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
          <StockTypeSelect value={watch('productType')} onChange={(value) => setValue('productType', value)} />
          <Input {...register('quantity', { valueAsNumber: true })} type="number" placeholder="Quantité" />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'En cours...' : stock ? 'Modifier' : 'Ajouter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
