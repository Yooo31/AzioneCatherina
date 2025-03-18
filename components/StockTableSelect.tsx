'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { stockTypes } from '@/types/stocksType';

export interface StockTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function StockTypeSelect({
  value,
  onValueChange,
  placeholder = 'Filtrer par type',
}: StockTypeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Tous">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ccc',
                display: 'inline-block',
              }}
            />
            Tous
          </span>
        </SelectItem>
        {stockTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: type.color,
                  display: 'inline-block',
                }}
              />
              {type.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
