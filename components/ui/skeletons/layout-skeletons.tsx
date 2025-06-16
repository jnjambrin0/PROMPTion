import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonNavigation, SkeletonUserProfile } from "./base-skeletons"

// ============================================================================
// SIDEBAR SKELETON - Para la barra lateral principal
// ============================================================================

export function SidebarSkeleton({ className = "" }: { className?: string }) {
  return (
    <aside className={cn(
      "w-64 h-screen border-r border-neutral-200 bg-neutral-50/30 p-4 flex flex-col",
      className
    )}>
      {/* Brand Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-6">
        <SkeletonNavigation items={4} />
      </div>

      {/* Separator */}
      <div className="h-px bg-neutral-200 mb-4" />

      {/* Workspaces Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3 px-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-4" />
        </div>
        
        <div className="space-y-1 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-4" />
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="h-px bg-neutral-200 mb-4" />

        {/* Navigation Section */}
        <div>
          <Skeleton className="h-3 w-16 mb-3 mx-3" />
          <SkeletonNavigation items={5} />
        </div>
      </div>

      {/* User Info Skeleton */}
      <div className="mt-auto pt-4 border-t border-neutral-200">
        <SkeletonUserProfile showEmail />
      </div>
    </aside>
  )
}

// ============================================================================
// RIGHT SIDEBAR SKELETON - Para la barra lateral derecha
// ============================================================================

export function RightSidebarSkeleton({ className = "" }: { className?: string }) {
  return (
    <aside className={cn(
      "w-72 border-l h-full border-neutral-200 bg-neutral-25/50 p-6",
      className
    )}>
      {/* Quick Stats Section */}
      <div className="mb-8">
        <Skeleton className="h-5 w-16 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-8" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-3 w-20 mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-neutral-200 mb-6" />

      {/* Recent Activity Section */}
      <div className="mb-8">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-full mt-1" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-neutral-200 mb-6" />

      {/* Popular Topics Section */}
      <div>
        <Skeleton className="h-5 w-20 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-4" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

// ============================================================================
// MOBILE NAVIGATION SKELETON
// ============================================================================

export function MobileNavSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("w-80 p-4", className)}>
      {/* Brand */}
      <div className="mb-6">
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <SkeletonNavigation items={4} />
      </div>

      {/* Separator */}
      <div className="h-px bg-neutral-200 mb-4" />

      {/* Workspace Navigation */}
      <div className="mb-6">
        <Skeleton className="h-3 w-20 mb-3" />
        <SkeletonNavigation items={3} />
      </div>

      {/* Separator */}
      <div className="h-px bg-neutral-200 mb-4" />

      {/* Main Navigation */}
      <div className="mb-6">
        <Skeleton className="h-3 w-16 mb-3" />
        <SkeletonNavigation items={5} />
      </div>

      {/* Separator */}
      <div className="h-px bg-neutral-200 mb-4" />

      {/* Coming up section */}
      <div className="mb-6">
        <Skeleton className="h-4 w-20 mb-3" />
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className="mt-0.5 rounded-md bg-neutral-100 p-1.5">
                <Skeleton className="h-3 w-3" />
              </div>
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div>
        <Skeleton className="h-4 w-20 mb-3" />
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PAGE HEADER SKELETON - Para headers de páginas
// ============================================================================

export function PageHeaderSkeleton({ 
  showBackButton = false,
  showActions = true,
  showBreadcrumb = false,
  className = ""
}: {
  showBackButton?: boolean
  showActions?: boolean
  showBreadcrumb?: boolean
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {showBreadcrumb && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && <Skeleton className="h-8 w-8" />}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// TAB NAVIGATION SKELETON
// ============================================================================

export function TabNavigationSkeleton({ 
  tabs = 5,
  className = ""
}: {
  tabs?: number
  className?: string
}) {
  return (
    <div className={cn("border-b border-neutral-200", className)}>
      <nav className="flex space-x-8">
        {Array.from({ length: tabs }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 py-3 px-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </nav>
    </div>
  )
} 