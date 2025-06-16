import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  SkeletonStatsGrid, 
  SkeletonSearchAndFilters, 
  SkeletonCard,
  SkeletonGrid
} from "./base-skeletons"
import { PageHeaderSkeleton } from "./layout-skeletons"

// ============================================================================
// DASHBOARD SKELETON - Página principal del dashboard
// ============================================================================

export function DashboardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex justify-center w-full min-h-full", className)}>
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* Workspaces Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-neutral-200 mb-8" />

        {/* Prompts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HOME SKELETON - Página principal de inicio
// ============================================================================

export function HomeSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex justify-center w-full min-h-full", className)}>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <Skeleton className="h-7 md:h-8 w-64 mb-1" />
          <Skeleton className="h-4 md:h-5 w-48" />
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-6 md:mb-8">
          <Skeleton className="h-5 md:h-6 w-24 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border-2 border-dashed border-neutral-200 p-4 aspect-square">
                <div className="flex flex-col items-center justify-center h-2/4 space-y-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-neutral-200 mb-6 md:mb-8" />

        {/* Recent Activity */}
        <div>
          <Skeleton className="h-5 md:h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PROFILE SKELETON - Página de perfil de usuario
// ============================================================================

export function ProfileSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("min-h-screen bg-neutral-25", className)}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-4 w-20" />
          </div>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-6">
              {/* Avatar and basic info */}
              <div className="text-center mb-6">
                <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-1" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>

              {/* Stats */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// NOTIFICATIONS SKELETON - Página de notificaciones
// ============================================================================

export function NotificationsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("min-h-screen bg-neutral-25", className)}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-4 w-20" />
          </div>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
            
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Filters and Search */}
        <SkeletonSearchAndFilters className="mb-6" />

        {/* Summary Stats */}
        <SkeletonStatsGrid items={4} className="mb-8" />

        {/* Notifications List */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TEMPLATES SKELETON - Página de templates
// ============================================================================

export function TemplatesSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex justify-center w-full min-h-full", className)}>
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <PageHeaderSkeleton showActions className="mb-6" />

        {/* Search and Filters */}
        <SkeletonSearchAndFilters className="mb-6" />

        {/* Categories */}
        <div className="mb-6">
          <Skeleton className="h-5 w-24 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <SkeletonGrid 
          items={9} 
          columns={3} 
          itemHeight="h-48"
        />
      </div>
    </div>
  )
}

// ============================================================================
// SETTINGS SKELETON - Página de configuración
// ============================================================================

export function SettingsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("min-h-screen bg-neutral-25", className)}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-48 mt-2" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} contentLines={4} showFooter />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 