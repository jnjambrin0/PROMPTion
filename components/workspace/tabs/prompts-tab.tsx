'use client'

import { useMemo, useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit3,
  MoreHorizontal,
  Clock,
  User,
  RefreshCcw,
  Hash,
  ArrowRight
} from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface PromptsTabProps {
  workspaceSlug: string
  workspaceData: {
    workspace: any
    categories: any[]
    members: any[]
    prompts?: any[]
    stats?: any
  }
}

interface TransformedPrompt {
  id: string
  slug: string
  name: string
  description: string
  category: string
  categoryId: string
  isPublic: boolean
  isTemplate: boolean
  blocks: number
  views: number
  author: {
    name: string
    avatar: string | null
  }
  updatedAt: Date
  createdAt: Date
}

interface FilterCategory {
  id: string
  name: string
}

// Server Component for better performance
function StatCard({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}

// Custom hook for search debouncing
function usePromptSearch(prompts: TransformedPrompt[], searchQuery: string) {
  const debouncedQuery = useDebounce(searchQuery, 300)
  
  return useMemo(() => {
    if (!debouncedQuery.trim()) return prompts
    
    const query = debouncedQuery.toLowerCase()
    return prompts.filter(prompt => 
      prompt.name.toLowerCase().includes(query) ||
      prompt.description.toLowerCase().includes(query) ||
      prompt.category.toLowerCase().includes(query) ||
      prompt.author.name.toLowerCase().includes(query)
    )
  }, [prompts, debouncedQuery])
}

// Custom hook for filtering
function usePromptFilters(prompts: TransformedPrompt[], selectedCategory: string) {
  return useMemo(() => {
    if (selectedCategory === 'all') return prompts
    return prompts.filter(prompt => prompt.categoryId === selectedCategory)
  }, [prompts, selectedCategory])
}

// Memoized prompt card component
function PromptCard({ prompt, workspaceSlug }: { prompt: TransformedPrompt; workspaceSlug: string }) {
  const [isPending, startTransition] = useTransition()

  const handleAction = useCallback((action: string) => {
    startTransition(() => {
      console.log(`${action} prompt:`, prompt.id)
    })
  }, [prompt.id])

  return (
    <Card className="group hover:shadow-sm transition-all hover:border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base line-clamp-1">{prompt.name}</CardTitle>
                <div className="flex gap-1">
                  {prompt.isTemplate && (
                    <Badge variant="secondary" className="text-xs">
                      Template
                    </Badge>
                  )}
                  {prompt.isPublic && (
                    <Badge variant="outline" className="text-xs">
                      Public
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="text-sm line-clamp-1">
                {prompt.description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isPending}
            onClick={() => handleAction('more')}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
        
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>{prompt.blocks} blocks</span>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {prompt.views} views
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {prompt.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 h-7"
              asChild
            >
              <Link href={`/${workspaceSlug}/${prompt.slug}`}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-7 px-2"
              disabled={isPending}
              onClick={() => handleAction('edit')}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Empty state component
function EmptyState({ 
  searchQuery, 
  selectedCategory, 
  onClearFilters, 
  workspaceSlug 
}: {
  searchQuery: string
  selectedCategory: string
  onClearFilters: () => void
  workspaceSlug: string
}) {
  const hasFilters = searchQuery || selectedCategory !== 'all'

  return (
    <div className="text-center py-8">
      <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      {hasFilters ? (
        <>
          <h3 className="text-base font-medium text-foreground mb-2">No prompts found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button variant="outline" onClick={onClearFilters}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-base font-medium text-foreground mb-2">No prompts yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get started by creating your first prompt
          </p>
          <Button asChild>
            <Link href={`/${workspaceSlug}/prompts/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Create first prompt
            </Link>
          </Button>
        </>
      )}
    </div>
  )
}

export default function PromptsTab({ workspaceSlug, workspaceData }: PromptsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const { workspace, categories, prompts, stats } = workspaceData

  // Memoized data transformations
  const transformedPrompts = useMemo(() => {
    if (!prompts || prompts.length === 0) return []
    
    return prompts.map(prompt => ({
      id: prompt.id,
      slug: prompt.slug,
      name: prompt.title,
      description: prompt.description || 'No description available',
      category: prompt.category?.name || 'Uncategorized',
      categoryId: prompt.category?.id || 'uncategorized',
      isPublic: prompt.isPublic,
      isTemplate: prompt.isTemplate,
      blocks: prompt._count?.blocks || 0,
      views: Math.floor(Math.random() * 100) + 10, // Simular views hasta implementar analytics
      author: { 
        name: prompt.user?.fullName || prompt.user?.username || 'Unknown',
        avatar: prompt.user?.avatarUrl || null 
      },
      updatedAt: new Date(prompt.updatedAt),
      createdAt: new Date(prompt.createdAt)
    }))
  }, [prompts])

  // Filter categories with memoization
  const filterCategories = useMemo(() => {
    const realCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name
    }))
    
    const hasUncategorized = transformedPrompts.some(p => p.categoryId === 'uncategorized')
    if (hasUncategorized) {
      realCategories.push({ id: 'uncategorized', name: 'Uncategorized' })
    }
    
    return [
      { id: 'all', name: 'All Categories' },
      ...realCategories
    ]
  }, [categories, transformedPrompts])

  // Apply search and filters with custom hooks
  const searchResults = usePromptSearch(transformedPrompts, searchQuery)
  const filteredPrompts = usePromptFilters(searchResults, selectedCategory)

  // Optimized handlers
  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('all')
  }, [])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Prompts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize all your prompts
          </p>
        </div>
        <Button asChild>
          <Link href={`/${workspaceSlug}/prompts/new`}>
            <Plus className="h-4 w-4 mr-2" />
            New Prompt
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {filterCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={MessageSquare}
          label="Prompts"
          value={stats.totalPrompts}
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={stats.totalViews}
        />
        <StatCard
          icon={Filter}
          label="Templates"
          value={stats.templatesCount}
        />
        <StatCard
          icon={User}
          label="Public"
          value={stats.publicPromptsCount}
        />
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onClearFilters={handleClearFilters}
          workspaceSlug={workspaceSlug}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function PromptsTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-muted rounded animate-pulse" />
      </div>

      {/* Search and filters skeleton */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-9 bg-muted rounded animate-pulse" />
        <div className="h-9 w-32 bg-muted rounded animate-pulse" />
        <div className="h-9 w-20 bg-muted rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-5 w-12 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Prompts grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 