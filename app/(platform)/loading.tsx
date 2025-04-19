import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loding() {
  return (
    <div>
      <Skeleton className="mb-4 h-10 w-60" />
      <Skeleton className="mb-4 h-10 w-72" />
      <Skeleton className="mb-4 h-52 w-full" />
    </div>
  );
}
