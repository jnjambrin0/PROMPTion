'use client'

import { useState, useMemo, useCallback } from 'react'
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
    workspace?: string
    type?: string
    sort?: string
  }
}

// Enhanced Prompt Card Component
const EnhancedPromptCard = ({ prompt }: { prompt: Prompt }) => (
    <Link
    href={`/${prompt.workspace.slug}/${prompt.slug}`}
    className="group block bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
    >
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-700">
            {prompt.title}
          </h3>
          {prompt.description && (
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
              {prompt.description}
            </p>
          )}
        </div>
        
        {/* Status badges */}
        <div className="flex items-center gap-1 ml-3 shrink-0">
            {prompt.isTemplate && (
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              <FileText className="h-3 w-3" />
                Template
            </div>
            )}
            {prompt.isPublic && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
              <Globe className="h-3 w-3" />
                Public
            </div>
            )}
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-neutral-200 flex items-center justify-center">
              <span className="text-xs font-medium text-neutral-600">
                {prompt.workspace.name.charAt(0).toUpperCase()}
          </span>
            </div>
            <span className="truncate">{prompt.workspace.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{prompt._count.blocks} blocks</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(prompt.updatedAt)} ago</span>
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
        <div className="h-5 w-5 rounded-full bg-neutral-200 flex items-center justify-center">
          <Users className="h-3 w-3 text-neutral-500" />
        </div>
        <span className="text-xs text-neutral-600">
          {prompt.user.fullName || prompt.user.username || 'Anonymous'}
          </span>
        </div>
      </div>
    </Link>
  )

// Compact List Item Component  
const CompactPromptItem = ({ prompt }: { prompt: Prompt }) => (
    <Link
    href={`/${prompt.workspace.slug}/${prompt.slug}`}
    className="group block bg-white rounded-lg border border-neutral-200 p-3 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
    >
    <div className="flex items-center gap-3">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-neutral-900 truncate group-hover:text-neutral-700">
            {prompt.title}
          </h3>
          
          {/* Inline badges */}
          <div className="flex items-center gap-1 shrink-0">
            {prompt.isTemplate && (
              <div className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                Template
              </div>
            )}
            {prompt.isPublic && (
              <div className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                Public
              </div>
            )}
          </div>
        </div>
        
        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-neutral-200 flex items-center justify-center">
              <span className="text-xs font-medium text-neutral-600">
                {prompt.workspace.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span>{prompt.workspace.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{prompt._count.blocks}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{prompt.user.fullName || prompt.user.username || 'Anonymous'}</span>
      </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(prompt.updatedAt)} ago</span>
          </div>
        </div>
      </div>
      </div>
    </Link>
  )

// Main Client Component - Optimized for instant navigation
export function PromptsSectionClient({ prompts, initialSearchParams }: PromptsSectionClientProps) {
  // Local state for instant filtering (no server round-trips)
  const [currentView, setCurrentView] = useState(initialSearchParams.view || 'list')
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
  }, [prompts, workspaceFilter, typeFilter, sortBy])

  // Current filters object for components
  const currentFilters = useMemo(() => ({
    workspace: workspaceFilter,
    type: typeFilter,
    sort: sortBy
  }), [workspaceFilter, typeFilter, sortBy])

  // Content render - memoized for performance
  const renderContent = useMemo(() => {
    if (filteredPrompts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {workspaceFilter !== 'all' || typeFilter !== 'all' 
              ? 'No prompts found' 
              : 'No prompts yet'
            }
          </h3>
          <p className="text-neutral-600 mb-6">
            {workspaceFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start creating prompts to see them here'
            }
          </p>
          {(workspaceFilter === 'all' && typeFilter === 'all') && (
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
  }, [filteredPrompts, currentView, workspaceFilter, typeFilter])

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