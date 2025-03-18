export type Stock = {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  updatedAt: string;
  updatedByUser?: { username: string } | null;
};
