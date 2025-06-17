import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function PromptSettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2 md:p-4">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <Separator />

      {/* Tabs Skeleton */}
      <div className="space-y-6 md:space-y-8">
        <div className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-12 p-1 border rounded-lg gap-1">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Tab Content Skeleton */}
        <div className="p-1">
          <div className="space-y-6 rounded-lg border p-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 w-1/2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 