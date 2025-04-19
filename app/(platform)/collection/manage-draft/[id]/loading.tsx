import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-4 h-10 w-60" />
      <Skeleton className="mb-4 h-52 w-full" />
      <div className="mb-4 flex gap-4">
        <Skeleton className="h-24 flex-1" />
        <Skeleton className="h-24 flex-1" />
        <Skeleton className="h-24 flex-1" />
        <Skeleton className="h-24 flex-1" />
      </div>
      <Skeleton className="mb-4 h-10 w-72" />
      <Skeleton className="mb-4 h-44 w-full" />
    </div>
  );
}
