import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { stockTypes } from '@/app/constants/stockTypes';

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export function StockTypeSelect({ value, onChange }: Props) {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Type de produit" />
      </SelectTrigger>
      <SelectContent>
        {stockTypes.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
