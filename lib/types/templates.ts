// ==================== TEMPLATE TYPES ====================
// Tipos separados para evitar imports de DB en client components

import type { AIModelConfig, BlockContentData } from './shared'

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  description: string
  required: boolean
  defaultValue?: string
  options?: string[]
}

export interface Template {
  id: string
  title: string
  slug: string
  description?: string | null
  icon?: string | null
  isTemplate: boolean
  isPublic: boolean
  isPinned: boolean
  aiModel?: string | null
  modelConfig: AIModelConfig
  variables: TemplateVariable[]
  viewCount: number
  useCount: number
  forkCount: number
  averageScore?: number | null
  currentVersion: number
  createdAt: Date
  updatedAt: Date
  lastUsedAt?: Date | null
  user: {
    id: string
    username?: string | null
    fullName?: string | null
    avatarUrl?: string | null
  }
  workspace: {
    id: string
    name: string
    slug: string
  }
  category?: {
    id: string
    name: string
    color?: string | null
    icon?: string | null
  } | null
  tags: Array<{
    tag: {
      id: string
      name: string
    }
  }>
  blocks: Array<{
    id: string
    type: string
    content: BlockContentData
    position: number
    indentLevel: number
    createdAt: Date
  }>
  _count: {
    comments: number
    favorites: number
    forks: number
  }
}

export interface TemplateFilters {
  categoryId?: string
  search?: string
  sort?: 'popular' | 'recent' | 'favorites' | 'alphabetical'
  page?: number
  limit?: number
}

export interface TemplateStats {
  totalTemplates: number
  totalAuthors: number
  totalUsage: number
  featuredCount: number
}

export interface TemplateCategory {
  id: string
  name: string
  description?: string | null
  color?: string | null
  icon?: string | null
  _count: {
    prompts: number
  }
}

// Template listing interface (reduced fields for performance)
export interface TemplateListItem {
  id: string
  title: string
  slug: string
  description?: string | null
  icon?: string | null
  viewCount: number
  useCount: number
  forkCount: number
  averageScore?: number | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username?: string | null
    fullName?: string | null
    avatarUrl?: string | null
  }
  workspace: {
    id: string
    name: string
    slug: string
  }
  category?: {
    id: string
    name: string
    color?: string | null
    icon?: string | null
  } | null
  tags: Array<{
    tag: {
      id: string
      name: string
    }
  }>
  _count: {
    comments: number
    favorites: number
    forks: number
  }
} 