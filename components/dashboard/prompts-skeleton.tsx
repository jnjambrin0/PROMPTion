import { Skeleton } from '@/components/ui/skeleton'

interface PromptsSkeletonProps {
  view: string
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-5">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg border border-neutral-200 p-4">
      <Skeleton className="h-8 w-8 rounded" />
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

export function PromptsSkeleton({ view }: PromptsSkeletonProps) {
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  )
} 