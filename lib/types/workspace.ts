// ============================================================================
// WORKSPACE TYPES - Single source of truth
// ============================================================================

export interface WorkspaceStats {
  totalPrompts: number
  totalMembers: number
  totalCategories: number
  recentActivity: number
  templatesCount: number
  publicPromptsCount: number
  thisWeekPrompts: number
  totalViews: number
}

export interface WorkspaceMember {
  id: string
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'
  permissions: {
    canManageWorkspace: boolean
    canInviteMembers: boolean
    canDeletePrompts: boolean
  }
  joinedAt: Date | null
  lastActiveAt: Date | null
  user: {
    id: string
    username: string | null
    fullName: string | null
    avatarUrl: string | null
    email: string
  }
}

export interface WorkspacePrompt {
  id: string
  slug: string
  title: string
  description: string | null
  isPublic: boolean
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    color: string | null
  } | null
  user: {
    id: string
    username: string | null
    fullName: string | null
    avatarUrl: string | null
  }
  _count: {
    blocks: number
  }
}

export interface WorkspaceCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  isDefault: boolean
  parentId: string | null
  _count: {
    prompts: number
    children: number
  }
}

export interface WorkspaceData {
  workspace: {
    id: string
    name: string
    slug: string
    description: string | null
    logoUrl: string | null
    plan: string
    createdAt: Date
    ownerId: string
    _count: {
      prompts: number
      members: number
      categories: number
    }
  }
  categories: WorkspaceCategory[]
  members: WorkspaceMember[]
  prompts: WorkspacePrompt[]
  stats: WorkspaceStats
  currentUser: {
    id: string
    username: string
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

// Tab types
export type WorkspaceTab = 'overview' | 'prompts' | 'categories' | 'members' | 'settings'

// Navigation hook type
export interface WorkspaceNavigation {
  navigateToTab: (tab: WorkspaceTab, queryParams?: Record<string, string>) => void
  navigateToPrompts: (categoryId?: string) => void
  navigateToCategories: () => void
  navigateToMembers: () => void
  navigateToSettings: () => void
  navigateToOverview: () => void
  createNavigationButton: (tab: WorkspaceTab, queryParams?: Record<string, string>) => {
    onClick: (e: React.MouseEvent) => void
  }
}

export interface WorkspaceTabProps {
  workspaceSlug: string
  workspaceData: WorkspaceData
  navigation: WorkspaceNavigation
} 