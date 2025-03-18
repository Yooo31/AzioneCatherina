export const stockTypes = [
  { value: 'alcool', label: 'Alcool', color: '#E5A300' },
  { value: 'soft', label: 'Soft', color: '#1100E5' },
  { value: 'redWine', label: 'Vin rouge', color: '#D40027' },
  { value: 'whiteWine', label: 'Vin blanc', color: '#FFFF8F' },
  { value: 'pinkWine', label: 'Vin rosé', color: '#FF8FD0' },
  { value: 'frozenFood', label: 'Surgelé', color: '#27E1F4' },
  { value: 'dryFood', label: 'Sec', color: '#43F427' },
  { value: 'equipment', label: 'Équipement', color: '#000000' },
];

export const getStockType = (value: string) => stockTypes.find((type) => type.value === value);
