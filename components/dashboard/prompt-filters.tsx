'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Search, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

interface Workspace {
  id: string
  name: string
  slug: string
}

interface PromptFiltersProps {
  workspaces: Workspace[]
  currentFilters: {
    search?: string
    workspace?: string
    type?: string
    sort?: string
  }
  onSearchChange?: (value: string) => void
  onWorkspaceChange?: (value: string) => void
  onTypeChange?: (value: string) => void
  onSortChange?: (value: string) => void
}

export function PromptFilters({ 
  workspaces, 
  currentFilters, 
  onSearchChange, 
  onWorkspaceChange, 
  onTypeChange, 
  onSortChange 
}: PromptFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '')
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Update search when debounced value changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch)
    } else {
      // Fallback to URL updates if no callback provided
      const params = new URLSearchParams(searchParams.toString())
      
      if (debouncedSearch) {
        params.set('search', debouncedSearch)
      } else {
        params.delete('search')
      }
      
      router.push(`?${params.toString()}`)
    }
  }, [debouncedSearch, onSearchChange, router, searchParams])

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
    setSearchQuery('')
    router.push(window.location.pathname)
  }

  const hasActiveFilters = Boolean(
    currentFilters.search ||
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
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

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