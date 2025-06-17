import { Skeleton } from '@/components/ui/skeleton';

export default function SearchLoading() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Search Input Skeleton */}
        <Skeleton className="h-12 w-full" />

        {/* Filter Badges Skeleton */}
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Results Skeleton */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 