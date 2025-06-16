'use client'

import { useState, useCallback, useMemo, Suspense } from 'react'
import { LayoutDashboard, MessageSquare, FolderOpen, Users, Settings } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useWorkspaceNavigation } from '@/lib/hooks/use-workspace-navigation'
import type { WorkspaceData, WorkspaceTab } from '@/lib/types/workspace'

// Dynamic imports for code splitting - tabs only load when needed
const OverviewTab = dynamic(() => import('@/components/workspace/tabs/overview-tab'), {
  loading: () => <TabLoadingSkeleton />
})

const PromptsTab = dynamic(() => import('@/components/workspace/tabs/prompts-tab'), {
  loading: () => <TabLoadingSkeleton />
})

const CategoriesTab = dynamic(() => import('@/components/workspace/tabs/categories-tab'), {
  loading: () => <TabLoadingSkeleton />
})

const MembersTab = dynamic(() => import('@/components/workspace/tabs/members-tab'), {
  loading: () => <TabLoadingSkeleton />
})

const WorkspaceSettingsTab = dynamic(() => import('@/components/workspace/tabs/workspace-settings-tab'), {
  loading: () => <TabLoadingSkeleton />
})

interface WorkspacePageClientProps {
  workspaceSlug: string
  initialData: WorkspaceData
  initialTab?: string
  userId: string
}

const TABS: { id: WorkspaceTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'prompts', label: 'Prompts', icon: MessageSquare },
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function TabLoadingSkeleton() {
  return (
    <div className="min-h-[400px] animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-48 bg-neutral-200 rounded"></div>
        <div className="h-4 w-full bg-neutral-200 rounded"></div>
        <div className="h-4 w-3/4 bg-neutral-200 rounded"></div>
      </div>
    </div>
  )
}

export function WorkspacePageClient({ 
  workspaceSlug, 
  initialData, 
  initialTab 
}: WorkspacePageClientProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(() => {
    const validTab = TABS.find(t => t.id === initialTab)
    return validTab ? validTab.id : 'overview'
  })

  // Navigation hook for compatibility with existing tabs
  const navigation = useWorkspaceNavigation({
    workspaceSlug,
    onTabChange: setActiveTab
  })

  // Memoized stats for tab badges
  const tabStats = useMemo(() => ({
    totalPrompts: initialData.stats?.totalPrompts || 0,
    totalCategories: initialData.stats?.totalCategories || 0,
    totalMembers: initialData.stats?.totalMembers || 0,
  }), [initialData.stats])

  // Optimized tab switching with URL updates
  const handleTabChange = useCallback((tab: WorkspaceTab) => {
    setActiveTab(tab)
    
    // Update URL without page refresh
    const url = new URL(window.location.href)
    if (tab === 'overview') {
      url.searchParams.delete('tab')
    } else {
      url.searchParams.set('tab', tab)
    }
    
    window.history.replaceState({ tab }, '', url.toString())
  }, [])

  // Render active tab with proper props
  const renderActiveTab = useCallback(() => {
    const commonProps = {
      workspaceSlug,
      workspaceData: initialData,
      navigation
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
        // WorkspaceSettingsTab expects different props structure
        const settingsProps = {
          workspaceSlug,
          workspaceData: {
            workspace: initialData.workspace,
            categories: initialData.categories?.map(cat => ({
              id: cat.id,
              name: cat.name,
              color: cat.color,
              icon: cat.icon
            })) || [],
            members: initialData.members?.map(member => ({
              id: member.id,
              role: member.role,
              joinedAt: member.joinedAt || new Date(),
              user: member.user
            })) || [],
            prompts: initialData.prompts?.map(prompt => ({
              id: prompt.id,
              title: prompt.title,
              slug: prompt.slug,
              description: prompt.description,
              isPublic: prompt.isPublic,
              isTemplate: prompt.isTemplate,
              createdAt: prompt.createdAt,
              updatedAt: prompt.updatedAt
            })) || [],
            stats: initialData.stats ? {
              totalPrompts: initialData.stats.totalPrompts,
              totalMembers: initialData.stats.totalMembers,
              totalCategories: initialData.stats.totalCategories,
              publicPrompts: initialData.stats.publicPromptsCount || 0
            } : undefined
          }
        }
        return <WorkspaceSettingsTab {...settingsProps} />
      default:
        return <OverviewTab {...commonProps} />
    }
  }, [activeTab, workspaceSlug, initialData, navigation])

  return (
    <div className="h-full bg-neutral-25">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <nav className="flex space-x-8">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'border-neutral-900 text-neutral-900' 
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === 'prompts' && tabStats.totalPrompts > 0 && (
                    <span className="ml-1 bg-neutral-100 text-neutral-600 py-0.5 px-2 rounded-full text-xs">
                      {tabStats.totalPrompts}
                    </span>
                  )}
                  {tab.id === 'categories' && tabStats.totalCategories > 0 && (
                    <span className="ml-1 bg-neutral-100 text-neutral-600 py-0.5 px-2 rounded-full text-xs">
                      {tabStats.totalCategories}
                    </span>
                  )}
                  {tab.id === 'members' && tabStats.totalMembers > 0 && (
                    <span className="ml-1 bg-neutral-100 text-neutral-600 py-0.5 px-2 rounded-full text-xs">
                      {tabStats.totalMembers}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
            
        {/* Tab content with Suspense for better loading */}
        <Suspense fallback={<TabLoadingSkeleton />}>
          <div className="min-h-[600px]">
            {renderActiveTab()}
          </div>
        </Suspense>
      </div>
    </div>
  )
} 