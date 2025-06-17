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
  Hash,
  Trash2,
  Copy,
  Share2
} from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface WorkspaceData {
  workspace: {
    id: string
    name: string
    slug: string
  }
  categories: Array<{
    id: string
    name: string
    color: string | null
    icon: string | null
  }>
  members: Array<{
    id: string
    role: string
    user: {
      id: string
      fullName: string | null
      username: string | null
    }
  }>
  prompts?: Array<{
    id: string
    slug: string
    title: string
    description: string | null
    isPublic: boolean
    isTemplate: boolean
    createdAt: string | Date
    updatedAt: string | Date
    user: {
      id: string
      fullName: string | null
      username: string | null
      avatarUrl: string | null
    }
    category: {
      id: string
      name: string
      color: string | null
    } | null
    _count: {
      blocks: number
    }
  }>
  stats?: {
    totalPrompts: number
    totalViews: number
    templatesCount: number
    publicPromptsCount: number
  }
}

interface PromptsTabProps {
  workspaceSlug: string
  workspaceData: WorkspaceData
}

interface TransformedPrompt {
  id: string
  slug: string
  name: string
  description: string
  category: string
  categoryId: string
  categoryColor: string | null
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

  const handleAction = (action: string) => {
    startTransition(() => {
      // Handle actions here
      console.log(`Action: ${action} for prompt: ${prompt.id}`)
    })
  }

  // Convert color name to hex value
  const getColorHex = (colorName: string | null): string => {
    if (!colorName) return '#6b7280' // default gray
    
    const colorMap: Record<string, string> = {
      'gray': '#6b7280',
      'blue': '#3b82f6', 
      'green': '#22c55e',
      'yellow': '#eab308',
      'red': '#ef4444',
      'purple': '#a855f7',
      'pink': '#ec4899',
      'indigo': '#6366f1'
    }
    
    // If it's already a hex color, return it
    if (colorName.startsWith('#')) return colorName
    
    // Otherwise, look up the color name
    return colorMap[colorName.toLowerCase()] || '#6b7280'
  }

  return (
    <Card className="group hover:shadow-sm transition-all hover:border-border h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <CardTitle className="text-sm sm:text-base line-clamp-1 order-1">{prompt.name}</CardTitle>
                <div className="flex gap-1 order-2 sm:order-2">
                  {prompt.isTemplate && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0.5"
                      style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                    >
                      <span className="hidden sm:inline">Template</span>
                      <span className="sm:hidden">T</span>
                    </Badge>
                  )}
                  {prompt.isPublic && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1.5 py-0.5"
                      style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}
                    >
                      <span className="hidden sm:inline">Public</span>
                      <span className="sm:hidden">P</span>
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="text-xs sm:text-sm line-clamp-2 leading-relaxed h-8 sm:h-10">
                {prompt.description}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 sm:h-7 sm:w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/${workspaceSlug}/${prompt.slug}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Prompt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={isPending}
                onClick={() => handleAction('edit')}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Prompt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                disabled={isPending}
                onClick={() => handleAction('duplicate')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={isPending}
                onClick={() => handleAction('share')}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                disabled={isPending}
                onClick={() => handleAction('delete')}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
        
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                <span>{prompt.blocks} blocks</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{prompt.views} views</span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-1 font-medium shrink-0"
              style={{ 
                backgroundColor: `${getColorHex(prompt.categoryColor)}20`,
                color: getColorHex(prompt.categoryColor),
                borderColor: `${getColorHex(prompt.categoryColor)}60`,
                fontWeight: '500'
              }}
            >
              {prompt.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}</span>
            <span>•</span>
            <User className="h-3 w-3" />
            <span className="truncate">{prompt.author.name}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-7 text-xs"
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
      </CardContent>
    </Card>
  )
}

// Empty state component
function EmptyState({ 
  searchQuery, 
  selectedCategory, 
  onClearFilters, 
  workspaceId
}: {
  searchQuery: string
  selectedCategory: string
  onClearFilters: () => void
  workspaceId: string
}) {
  const hasFilters = searchQuery || selectedCategory !== 'all'
  return (
    <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed">
      <MessageSquare className="mx-auto h-12 w-12 text-neutral-400" />
      <h3 className="mt-4 text-lg font-medium text-neutral-900">
        {hasFilters ? 'No prompts match your filters' : 'No prompts yet'}
      </h3>
      <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
        {hasFilters
          ? 'Try adjusting your search or clearing the filters to see all prompts.'
          : 'Get started by creating a new prompt for your workspace.'}
      </p>
      <div className="mt-6">
        {hasFilters ? (
          <Button onClick={onClearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        ) : (
          <Button asChild>
            <Link href={`/prompts/new?workspace=${workspaceId}`}>
              <Plus className="h-4 w-4 mr-2" />
              Create Prompt
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function PromptsTab({ workspaceSlug, workspaceData }: PromptsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const transformedPrompts = useMemo(() => {
    if (!workspaceData.prompts) return []
    return workspaceData.prompts.map(prompt => ({
      id: prompt.id,
      slug: prompt.slug,
      name: prompt.title,
      description: prompt.description || 'No description provided.',
      category: prompt.category?.name || 'Uncategorized',
      categoryId: prompt.category?.id || '',
      categoryColor: prompt.category?.color || null,
      isPublic: prompt.isPublic,
      isTemplate: prompt.isTemplate,
      blocks: prompt._count.blocks,
      views: 0, // Placeholder
      author: {
        name: prompt.user.fullName || prompt.user.username || 'Unknown User',
        avatar: prompt.user.avatarUrl,
      },
      updatedAt: new Date(prompt.updatedAt),
      createdAt: new Date(prompt.createdAt),
    }))
  }, [workspaceData.prompts])

  const filteredBySearch = usePromptSearch(transformedPrompts, searchQuery)
  const filteredPrompts = usePromptFilters(filteredBySearch, selectedCategory)

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('all')
  }, [])

  const stats = useMemo(() => ({
    totalPrompts: workspaceData.stats?.totalPrompts || 0,
    totalViews: workspaceData.stats?.totalViews || 0,
    templatesCount: workspaceData.stats?.templatesCount || 0,
    publicPromptsCount: workspaceData.stats?.publicPromptsCount || 0
  }), [workspaceData.stats])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="Total Prompts" value={stats.totalPrompts} />
        <StatCard icon={Eye} label="Total Views" value={stats.totalViews} />
        <StatCard icon={Hash} label="Templates" value={stats.templatesCount} />
        <StatCard icon={User} label="Public" value={stats.publicPromptsCount} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input 
            placeholder="Search prompts..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {workspaceData.categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href={`/prompts/new?workspace=${workspaceData.workspace.id}`}>
              <Plus className="h-4 w-4 mr-2" />
              Create Prompt
            </Link>
          </Button>
        </div>
      </div>
      
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} workspaceSlug={workspaceSlug} />
          ))}
        </div>
      ) : (
        <EmptyState 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onClearFilters={clearFilters}
          workspaceId={workspaceData.workspace.id}
        />
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