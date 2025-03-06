import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
  title: string;
  description: string;
}

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ErrorCard({ title, description }: ErrorCardProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
