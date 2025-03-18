import { Stock } from '@/types/stock';
import { StockForm } from './StockForm';

export function StockActions({ stock, userId }: { stock: Stock; userId: string }) {
  return <StockForm stock={stock} userId={userId} />;
}