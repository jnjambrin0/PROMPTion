'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { LayoutDashboard, MessageSquare, FolderOpen, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getWorkspaceDataAction } from '@/lib/actions/workspace'
import type { WorkspaceData, WorkspaceTab } from '@/lib/types/workspace'

// Import tab components
import OverviewTab from '@/components/workspace/tabs/overview-tab'
import PromptsTab from '@/components/workspace/tabs/prompts-tab'
import CategoriesTab from '@/components/workspace/tabs/categories-tab'
import MembersTab from '@/components/workspace/tabs/members-tab'
import WorkspaceSettingsTab from '@/components/workspace/tabs/workspace-settings-tab'

interface WorkspacePageProps {
  params: Promise<{ workspace: string }>
}

const TABS: { id: WorkspaceTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'prompts', label: 'Prompts', icon: MessageSquare },
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

// Loading skeleton components for better UX
const OverviewSkeleton = () => (
  <div className="space-y-6">
    <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
)

const PromptsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
)

const CategoriesSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
)

const MembersSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
)

const SettingsSkeleton = () => (
  <div className="space-y-6">
    <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
)

export default function WorkspacePage({ params }: WorkspacePageProps) {
  // ============================================================================
  // STATE MANAGEMENT - Optimized
  // ============================================================================
  
  const [workspaceSlug, setWorkspaceSlug] = useState<string>('')
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prefetchedTabs, setPrefetchedTabs] = useState<Set<WorkspaceTab>>(new Set())

  // ============================================================================
  // DATA FETCHING - Single optimized function with caching
  // ============================================================================
  
  const fetchWorkspaceData = useCallback(async (slug: string) => {
    if (!slug) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getWorkspaceDataAction(slug)
      
      if (result.success && result.data) {
        setData(result.data as WorkspaceData)
      } else {
        setError(result.error || 'Failed to load workspace data')
      }
    } catch (err) {
      console.error('Error fetching workspace data:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ============================================================================
  // PREFETCHING LOGIC - Smart preloading
  // ============================================================================

  const prefetchTabData = useCallback((tab: WorkspaceTab) => {
    if (prefetchedTabs.has(tab) || tab === activeTab) return

    // In a real app, you would prefetch specific data for each tab
    // For now, we'll just mark it as prefetched since we already have all data
    setPrefetchedTabs(prev => new Set([...prev, tab]))
  }, [prefetchedTabs, activeTab])

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    params.then(({ workspace }) => {
      setWorkspaceSlug(workspace)
      fetchWorkspaceData(workspace)
    })
  }, [params, fetchWorkspaceData])

  // Handle URL search params for tab switching
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get('tab') as WorkspaceTab
    if (tab && TABS.find(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [])

  // ============================================================================
  // TAB SWITCHING - Optimized with prefetching
  // ============================================================================
  
  const handleTabChange = useCallback((tab: WorkspaceTab) => {
    setActiveTab(tab)
    
    // Update URL without page reload
    const url = new URL(window.location.href)
    if (tab === 'overview') {
      url.searchParams.delete('tab')
    } else {
      url.searchParams.set('tab', tab)
    }
    window.history.replaceState({}, '', url.toString())
  }, [])

  const handleTabHover = useCallback((tab: WorkspaceTab) => {
    // Prefetch on hover for instant tab switching
    prefetchTabData(tab)
  }, [prefetchTabData])

  // ============================================================================
  // MEMOIZED VALUES - Performance optimization
  // ============================================================================

  const memoizedTabStats = useMemo(() => {
    if (!data) return {}
    
    return {
      totalPrompts: data.stats?.totalPrompts || 0,
      totalCategories: data.stats?.totalCategories || 0,
      totalMembers: data.stats?.totalMembers || 0,
    }
  }, [data])

  // ============================================================================
  // RENDER HELPERS - Memoized tab content
  // ============================================================================
  
  const renderActiveTab = useCallback(() => {
    if (!data) return null

    const commonProps = {
      workspaceSlug,
      workspaceData: data
    }

    switch (activeTab) {
      case 'overview':
        return (
          <Suspense fallback={<OverviewSkeleton />}>
            <OverviewTab {...commonProps} />
          </Suspense>
        )
      case 'prompts':
        return (
          <Suspense fallback={<PromptsSkeleton />}>
            <PromptsTab {...commonProps} />
          </Suspense>
        )
      case 'categories':
        return (
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesTab {...commonProps} />
          </Suspense>
        )
      case 'members':
        return (
          <Suspense fallback={<MembersSkeleton />}>
            <MembersTab {...commonProps} />
          </Suspense>
        )
      case 'settings':
        return (
          <Suspense fallback={<SettingsSkeleton />}>
            <WorkspaceSettingsTab {...commonProps} />
          </Suspense>
        )
      default:
        return (
          <Suspense fallback={<OverviewSkeleton />}>
            <OverviewTab {...commonProps} />
          </Suspense>
        )
    }
  }, [activeTab, workspaceSlug, data])

  // ============================================================================
  // ERROR & LOADING STATES - Enhanced UX
  // ============================================================================
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchWorkspaceData(workspaceSlug)}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full bg-gray-25">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header skeleton */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {TABS.map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center gap-2 py-3 px-1"
                >
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </nav>
          </div>
          
          {/* Content skeleton */}
          <div className="min-h-[600px]">
            <OverviewSkeleton />
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Workspace not found</h2>
          <p className="text-gray-600">The workspace you're looking for doesn't exist or you don't have access.</p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // MAIN RENDER - Optimized with hover prefetching
  // ============================================================================

  return (
    <div className="h-full bg-gray-25">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    onMouseEnter={() => handleTabHover(tab.id)}
                    className={`
                      flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors
                      ${isActive 
                        ? 'border-gray-900 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'prompts' && (
                      <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {memoizedTabStats.totalPrompts}
                      </span>
                    )}
                    {tab.id === 'categories' && (memoizedTabStats.totalCategories || 0) > 0 && (
                      <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {memoizedTabStats.totalCategories || 0}
                      </span>
                    )}
                    {tab.id === 'members' && (memoizedTabStats.totalMembers || 0) > 0 && (
                      <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {memoizedTabStats.totalMembers || 0}
                      </span>
                    )}
                  </button>
                )
              })}
          </nav>
        </div>
            
        {/* Tab content with optimized rendering */}
        <div className="min-h-[600px]">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  )
} 