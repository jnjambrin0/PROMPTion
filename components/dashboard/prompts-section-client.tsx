'use client'

import { useState, useMemo, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { Search, Plus, MessageSquare, FileText, Globe, Users, Clock } from 'lucide-react'
import { PromptViewSwitcher } from './prompt-view-switcher'
import { PromptFilters } from './prompt-filters'
import { PromptsSkeleton } from './prompts-skeleton'
import { formatDistanceToNow } from '@/lib/utils'

interface Prompt {
  id: string
  title: string
  slug: string
  description: string | null
  isTemplate: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    blocks: number
  }
  workspace: {
    id: string
    name: string
    slug: string
  }
  user: {
    id: string
    fullName: string | null
    username: string | null
    avatarUrl: string | null
  }
}

interface PromptsSectionClientProps {
  prompts: Prompt[]
  initialSearchParams: {
    view?: string
    search?: string
    workspace?: string
    type?: string
    sort?: string
  }
}

// Enhanced Prompt Card - Memoized for performance
const EnhancedPromptCard = ({ prompt }: { prompt: Prompt }) => {
  const getPromptIcon = () => {
    if (prompt.isTemplate) return FileText
    if (prompt.isPublic) return Globe
    return MessageSquare
  }

  const Icon = getPromptIcon()

  return (
    <Link
      href={`/${prompt.workspace.slug}/${prompt.slug}`}
      className="group block bg-white rounded-lg border border-neutral-200 p-5 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
          <Icon className="h-5 w-5 text-neutral-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-neutral-900 truncate group-hover:text-black">
              {prompt.title}
            </h3>
            {prompt.isTemplate && (
              <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200">
                Template
              </span>
            )}
            {prompt.isPublic && (
              <span className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded border border-green-200">
                Public
              </span>
            )}
          </div>
          
          <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
            {prompt.description || 'No description provided'}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded bg-neutral-400"></div>
            {prompt.workspace.name}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {prompt._count?.blocks || 0} blocks
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {prompt.user.fullName || prompt.user.username || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Link>
  )
}

// Compact List Item - Memoized for performance
const CompactPromptItem = ({ prompt }: { prompt: Prompt }) => {
  const getPromptIcon = () => {
    if (prompt.isTemplate) return FileText
    if (prompt.isPublic) return Globe
    return MessageSquare
  }

  const Icon = getPromptIcon()

  return (
    <Link
      href={`/${prompt.workspace.slug}/${prompt.slug}`}
      className="group flex items-center gap-4 bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all duration-200"
    >
      {/* Icon */}
      <div className="h-8 w-8 rounded bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
        <Icon className="h-4 w-4 text-neutral-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-neutral-900 truncate group-hover:text-black">
            {prompt.title}
          </h3>
          <div className="flex gap-1">
            {prompt.isTemplate && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
                Template
              </span>
            )}
            {prompt.isPublic && (
              <span className="px-1.5 py-0.5 text-xs bg-green-50 text-green-700 rounded">
                Public
              </span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-neutral-600 line-clamp-1">
          {prompt.description || 'No description'}
        </p>
      </div>

      {/* Metadata */}
      <div className="hidden md:flex items-center gap-6 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <div className="h-2 w-2 rounded bg-neutral-400"></div>
          {prompt.workspace.name}
        </span>
        <span>{prompt._count?.blocks || 0} blocks</span>
        <span>{formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}</span>
      </div>
    </Link>
  )
}

// Main Client Component - Optimized for instant navigation
export function PromptsSectionClient({ prompts, initialSearchParams }: PromptsSectionClientProps) {
  // Local state for instant filtering (no server round-trips)
  const [currentView, setCurrentView] = useState(initialSearchParams.view || 'list')
  const [searchQuery, setSearchQuery] = useState(initialSearchParams.search || '')
  const [workspaceFilter, setWorkspaceFilter] = useState(initialSearchParams.workspace || 'all')
  const [typeFilter, setTypeFilter] = useState(initialSearchParams.type || 'all')
  const [sortBy, setSortBy] = useState(initialSearchParams.sort || 'updated')

  // Get unique workspaces - memoized for performance
  const workspaces = useMemo(() => 
    Array.from(new Map(prompts.map(p => [p.workspace.id, p.workspace])).values())
  , [prompts])

  // Optimized filtering with useMemo for performance
  const filteredPrompts = useMemo(() => {
    let filtered = prompts

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.description?.toLowerCase().includes(searchLower) ||
        prompt.workspace.name.toLowerCase().includes(searchLower) ||
        prompt.user.fullName?.toLowerCase().includes(searchLower) ||
        prompt.user.username?.toLowerCase().includes(searchLower)
      )
    }

    // Workspace filter
    if (workspaceFilter !== 'all') {
      filtered = filtered.filter(prompt => prompt.workspace.id === workspaceFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(prompt => {
        switch (typeFilter) {
          case 'templates': return prompt.isTemplate
          case 'public': return prompt.isPublic
          case 'private': return !prompt.isPublic
          default: return true
        }
      })
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })
  }, [prompts, searchQuery, workspaceFilter, typeFilter, sortBy])

  // Current filters object for components
  const currentFilters = useMemo(() => ({
    search: searchQuery,
    workspace: workspaceFilter,
    type: typeFilter,
    sort: sortBy
  }), [searchQuery, workspaceFilter, typeFilter, sortBy])

  // Content render - memoized for performance
  const renderContent = useMemo(() => {
    if (filteredPrompts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {searchQuery || workspaceFilter !== 'all' || typeFilter !== 'all' 
              ? 'No prompts found' 
              : 'No prompts yet'
            }
          </h3>
          <p className="text-neutral-600 mb-6">
            {searchQuery || workspaceFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'Start creating prompts to see them here'
            }
          </p>
          {(!searchQuery && workspaceFilter === 'all' && typeFilter === 'all') && (
            <Link
              href="/prompts/new"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first prompt
            </Link>
          )}
        </div>
      )
    }

    if (currentView === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => (
            <EnhancedPromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {filteredPrompts.map((prompt) => (
          <CompactPromptItem key={prompt.id} prompt={prompt} />
        ))}
      </div>
    )
  }, [filteredPrompts, currentView, searchQuery, workspaceFilter, typeFilter])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-neutral-900">
          All prompts ({filteredPrompts.length})
        </h2>
        
        <div className="flex items-center gap-2">
          <PromptFilters 
            workspaces={workspaces}
            currentFilters={currentFilters}
            onSearchChange={setSearchQuery}
            onWorkspaceChange={setWorkspaceFilter}
            onTypeChange={setTypeFilter}
            onSortChange={setSortBy}
          />
          <PromptViewSwitcher 
            currentView={currentView} 
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Content */}
      {renderContent}
    </div>
  )
} 