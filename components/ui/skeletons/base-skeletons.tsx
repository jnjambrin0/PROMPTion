import { cn } from "@/lib/utils"
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonButton } from "@/components/ui/skeleton"

// ============================================================================
// CARD SKELETONS - Componentes base para cards
// ============================================================================

export function SkeletonCard({ 
  className = "",
  showHeader = true,
  showContent = true,
  showFooter = false,
  contentLines = 3
}: {
  className?: string
  showHeader?: boolean
  showContent?: boolean
  showFooter?: boolean
  contentLines?: number
}) {
  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-6", className)}>
      {showHeader && (
        <div className="mb-4">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      
      {showContent && (
        <div className="mb-4">
          <SkeletonText lines={contentLines} />
        </div>
      )}
      
      {showFooter && (
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <Skeleton className="h-4 w-24" />
          <SkeletonButton size="sm" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// LIST SKELETONS - Para listas de elementos
// ============================================================================

export function SkeletonListItem({ 
  showAvatar = false,
  showIcon = false,
  showAction = false,
  className = ""
}: {
  showAvatar?: boolean
  showIcon?: boolean
  showAction?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3 p-3", className)}>
      {showAvatar && <SkeletonAvatar size="md" />}
      {showIcon && <Skeleton className="h-4 w-4" />}
      
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      
      {showAction && <SkeletonButton size="sm" />}
    </div>
  )
}

export function SkeletonList({ 
  items = 5,
  showAvatar = false,
  showIcon = false,
  showAction = false,
  className = ""
}: {
  items?: number
  showAvatar?: boolean
  showIcon?: boolean
  showAction?: boolean
  className?: string
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonListItem
          key={i}
          showAvatar={showAvatar}
          showIcon={showIcon}
          showAction={showAction}
        />
      ))}
    </div>
  )
}

// ============================================================================
// STAT SKELETONS - Para estadísticas y métricas
// ============================================================================

export function SkeletonStat({ 
  showIcon = true,
  showTrend = false,
  className = ""
}: {
  showIcon?: boolean
  showTrend?: boolean
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border border-neutral-200 bg-white p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        {showIcon && <Skeleton className="h-4 w-4" />}
        {showTrend && <Skeleton className="h-3 w-8" />}
      </div>
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function SkeletonStatsGrid({ 
  items = 4,
  showIcon = true,
  showTrend = false,
  className = ""
}: {
  items?: number
  showIcon?: boolean
  showTrend?: boolean
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonStat
          key={i}
          showIcon={showIcon}
          showTrend={showTrend}
        />
      ))}
    </div>
  )
}

// ============================================================================
// NAVIGATION SKELETONS - Para navegación
// ============================================================================

export function SkeletonNavItem({ 
  className = ""
}: {
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3 p-2", className)}>
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

export function SkeletonNavigation({ 
  items = 5,
  className = ""
}: {
  items?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonNavItem key={i} />
      ))}
    </div>
  )
}

// ============================================================================
// SEARCH & FILTERS SKELETONS
// ============================================================================

export function SkeletonSearchAndFilters({ 
  showSearch = true,
  showFilters = true,
  showSort = true,
  className = ""
}: {
  showSearch?: boolean
  showFilters?: boolean
  showSort?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {showSearch && (
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {showFilters && <SkeletonButton />}
      {showSort && <SkeletonButton size="sm" />}
    </div>
  )
}

// ============================================================================
// USER PROFILE SKELETONS
// ============================================================================

export function SkeletonUserProfile({ 
  size = "md",
  showEmail = true,
  showRole = false,
  className = ""
}: {
  size?: "sm" | "md" | "lg"
  showEmail?: boolean
  showRole?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <SkeletonAvatar size={size} />
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        {showEmail && <Skeleton className="h-3 w-32" />}
        {showRole && <Skeleton className="h-3 w-16" />}
      </div>
    </div>
  )
}

// ============================================================================
// GRID SKELETONS - Para grids de elementos
// ============================================================================

export function SkeletonGrid({ 
  items = 6,
  columns = 3,
  itemHeight = "h-48",
  className = ""
}: {
  items?: number
  columns?: number
  itemHeight?: string
  className?: string
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns as keyof typeof gridCols], className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} className={itemHeight} />
      ))}
    </div>
  )
} 