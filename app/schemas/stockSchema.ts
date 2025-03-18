import { z } from 'zod';

export const stockSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1, 'Le nom du produit est requis'),
  productType: z.string().min(1, 'Le type de produit est requis'),
  quantity: z.number().int().min(0, 'La quantité doit être positive'),
});

export type StockFormData = z.infer<typeof stockSchema>;
