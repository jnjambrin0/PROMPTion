import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  SkeletonStatsGrid, 
  SkeletonCard,
  SkeletonGrid,
  SkeletonList
} from "./base-skeletons"
import { TabNavigationSkeleton } from "./layout-skeletons"

// ============================================================================
// WORKSPACE PAGE SKELETON - Página principal del workspace
// ============================================================================

export function WorkspaceSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("h-full bg-neutral-25", className)}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab Navigation Skeleton */}
        <TabNavigationSkeleton tabs={5} className="mb-6" />
        
        {/* Content Area */}
        <div className="min-h-[600px]">
          <WorkspaceOverviewSkeleton />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// WORKSPACE OVERVIEW SKELETON
// ============================================================================

export function WorkspaceOverviewSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-6xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>

      {/* Stats Grid */}
      <SkeletonStatsGrid items={4} showIcon showTrend className="mb-8" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Prompts */}
        <div className="lg:col-span-2 space-y-1">
          <Skeleton className="h-5 w-32 mb-4" />
          <SkeletonList items={5} showIcon />
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <Skeleton className="h-5 w-24 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 px-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// WORKSPACE PROMPTS TAB SKELETON
// ============================================================================

export function WorkspacePromptsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-6xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Stats */}
      <SkeletonStatsGrid items={4} />

      {/* Prompts Grid */}
      <SkeletonGrid items={6} columns={3} itemHeight="h-48" />
    </div>
  )
}

// ============================================================================
// WORKSPACE CATEGORIES TAB SKELETON
// ============================================================================

export function WorkspaceCategoriesSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-6xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-7 w-32" />
      </div>

      {/* Categories Grid */}
      <SkeletonGrid items={6} columns={3} itemHeight="h-32" />
    </div>
  )
}

// ============================================================================
// WORKSPACE MEMBERS TAB SKELETON
// ============================================================================

export function WorkspaceMembersSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-6xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-7 w-24" />
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      
      {/* Stats */}
      <SkeletonStatsGrid items={4} />

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// WORKSPACE SETTINGS TAB SKELETON
// ============================================================================

export function WorkspaceSettingsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-6xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} contentLines={3} showFooter />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// PROMPT PAGE SKELETON - Página individual de prompt
// ============================================================================

export function PromptPageSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-4xl mx-auto space-y-6 p-2", className)}>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Header */}
      <PromptHeaderSkeleton />
      
      {/* Separator */}
      <div className="h-px bg-neutral-200" />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <PromptContentSkeleton />
        </div>
        <div>
          <PromptSidebarSkeleton />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PROMPT COMPONENTS SKELETONS
// ============================================================================

function PromptHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-80" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-96" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

function PromptContentSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="space-y-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-5 w-5 mt-1" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PromptSidebarSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-neutral-200">
          <div className="p-4">
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// PROMPT EDIT PAGE SKELETON - Página de edición de prompt
// ============================================================================

export function PromptEditSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-4xl mx-auto space-y-6 p-2", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16" />
        ))}
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>

        {/* Variables */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 border border-neutral-200 rounded">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <Skeleton className="h-6 w-20 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PROMPT SETTINGS PAGE SKELETON - Página de configuración de prompt
// ============================================================================

export function PromptSettingsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 pb-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* General Settings Cards */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-neutral-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-64 mb-6" />
              
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* AI Configuration */}
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg border border-red-200">
          <div className="p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-4 w-80 mb-6" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
} 