'use client'

import { useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, MessageSquare, FolderOpen, Users, Settings, Plus } from 'lucide-react'
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

export default function WorkspacePage({ params }: WorkspacePageProps) {
  // ============================================================================
  // STATE MANAGEMENT - Simplified
  // ============================================================================
  
  const [workspaceSlug, setWorkspaceSlug] = useState<string>('')
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // DATA FETCHING - Single optimized function
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
  // TAB SWITCHING
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

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderActiveTab = () => {
    if (!data) return null

    const commonProps = {
      workspaceSlug,
      workspaceData: data
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...commonProps} />
      case 'prompts':
        return <PromptsTab {...commonProps} />
      case 'categories':
        return <CategoriesTab {...commonProps} />
      case 'members':
        return <MembersTab {...commonProps} />
      case 'settings':
        return <WorkspaceSettingsTab {...commonProps} />
      default:
        return <OverviewTab {...commonProps} />
    }
  }

  // ============================================================================
  // ERROR & LOADING STATES
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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
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
  // MAIN RENDER
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
                      {data.stats.totalPrompts}
                    </span>
                  )}
                  </button>
                )
              })}
          </nav>
            </div>
            
        {/* Tab content */}
        <div className="min-h-[600px]">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  )
} 