'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, X } from 'lucide-react'

interface Workspace {
  id: string
  name: string
  slug: string
}

interface PromptFiltersProps {
  workspaces: Workspace[]
  currentFilters: {
    workspace?: string
    type?: string
    sort?: string
  }
  onWorkspaceChange?: (value: string) => void
  onTypeChange?: (value: string) => void
  onSortChange?: (value: string) => void
}

export function PromptFilters({ 
  workspaces, 
  currentFilters, 
  onWorkspaceChange, 
  onTypeChange, 
  onSortChange 
}: PromptFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    // Use callback if provided, otherwise fallback to URL
    switch (key) {
      case 'workspace':
        if (onWorkspaceChange) {
          onWorkspaceChange(value)
          return
        }
        break
      case 'type':
        if (onTypeChange) {
          onTypeChange(value)
          return
        }
        break
      case 'sort':
        if (onSortChange) {
          onSortChange(value)
          return
        }
        break
    }
    
    // Fallback to URL updates
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all' || !value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(window.location.pathname)
  }

  const hasActiveFilters = Boolean(
    (currentFilters.workspace && currentFilters.workspace !== 'all') ||
    (currentFilters.type && currentFilters.type !== 'all')
  )

  const getWorkspaceName = (workspaceId: string) => {
    return workspaces.find(w => w.id === workspaceId)?.name || 'Unknown Workspace'
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'templates': return 'Templates'
      case 'public': return 'Public'
      case 'private': return 'Private'
      default: return 'All Types'
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Workspace Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-xs">
              {currentFilters.workspace && currentFilters.workspace !== 'all'
                ? getWorkspaceName(currentFilters.workspace)
                : 'All Workspaces'
              }
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Workspace</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => updateFilter('workspace', 'all')}>
            All Workspaces
          </DropdownMenuItem>
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => updateFilter('workspace', workspace.id)}
            >
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-neutral-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-neutral-600">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {workspace.name}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Type Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-xs">
              {getTypeName(currentFilters.type || 'all')}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-32">
          <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => updateFilter('type', 'all')}>
            All Types
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateFilter('type', 'templates')}>
            Templates
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateFilter('type', 'public')}>
            Public
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateFilter('type', 'private')}>
            Private
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-xs">
              {currentFilters.sort === 'title' ? 'Name' :
               currentFilters.sort === 'created' ? 'Created' : 'Updated'}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-32">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => updateFilter('sort', 'updated')}>
            Last Updated
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateFilter('sort', 'created')}>
            Date Created
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateFilter('sort', 'title')}>
            Name
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  )
} 