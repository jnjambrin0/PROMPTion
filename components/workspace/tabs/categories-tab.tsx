'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FolderOpen, Plus, Hash, MoreHorizontal, Edit2, Trash2, Search, Filter, ArrowRight, Import, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CategoriesTabProps {
  workspaceSlug: string
  workspaceData: {
    workspace: any
    categories: any[]
    members: any[]
    prompts?: any[]
    stats?: any
  }
}

interface CategoryWithCounts {
  id: string
  name: string
  description: string | null
  icon: string
  color: string
  promptCount: number
  isDefault?: boolean
  parentId?: string | null
  children?: CategoryWithCounts[]
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

function CategoryCard({ category, workspaceSlug }: { 
  category: CategoryWithCounts
  workspaceSlug: string 
}) {
  return (
    <Card className="group hover:shadow-sm transition-all hover:border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <span className="text-base">{category.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base truncate">{category.name}</CardTitle>
                {category.isDefault && (
                  <Badge variant="outline" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm line-clamp-1">
                {category.description || 'No description'}
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span>{category.promptCount} {category.promptCount === 1 ? 'prompt' : 'prompts'}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {category.color}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 h-7"
              asChild
            >
              <Link href={`/${workspaceSlug}?tab=prompts&category=${category.id}`}>
                View Prompts
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-7 px-2"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ 
  searchQuery, 
  onClearSearch, 
  workspaceSlug 
}: {
  searchQuery: string
  onClearSearch: () => void
  workspaceSlug: string
}) {
  return (
    <div className="text-center py-8">
      <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      {searchQuery ? (
        <>
          <h3 className="text-base font-medium text-foreground mb-2">No categories found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search query
          </p>
          <Button variant="outline" onClick={onClearSearch}>
            Clear search
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-base font-medium text-foreground mb-2">No categories yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first category to organize prompts
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create first category
          </Button>
        </>
      )}
    </div>
  )
}

// Improved Quick Actions Component
function QuickActionsSection({ workspaceSlug }: { workspaceSlug: string }) {
  const actions = [
    {
      icon: Plus,
      label: "Create Category",
      description: "Add a new category",
      href: `/${workspaceSlug}/categories/new`,
      primary: true
    },
    {
      icon: Import,
      label: "Import Categories", 
      description: "From CSV or JSON",
      href: `/${workspaceSlug}/categories/import`,
      primary: false
    },
    {
      icon: Settings,
      label: "Bulk Actions",
      description: "Edit multiple at once",
      href: `/${workspaceSlug}/categories/bulk`,
      primary: false
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {actions.map((action, index) => (
        <Card key={index} className="group hover:shadow-sm transition-all hover:border-border cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                action.primary ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {action.label}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CategoriesTab({ workspaceSlug, workspaceData }: CategoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { workspace, categories, prompts, stats } = workspaceData

  // Transform categories with prompt counts
  const categoriesWithCounts = useMemo((): CategoryWithCounts[] => {
    if (!categories || categories.length === 0) return []
    
    // Count prompts per category
    const categoryPromptCounts = new Map()
    if (prompts && prompts.length > 0) {
      prompts.forEach(prompt => {
        const categoryId = prompt.categoryId || 'uncategorized'
        categoryPromptCounts.set(categoryId, (categoryPromptCounts.get(categoryId) || 0) + 1)
      })
    }
    
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || null,
      icon: category.icon || '📋',
      color: category.color || 'gray',
      promptCount: categoryPromptCounts.get(category.id) || 0,
      isDefault: category.isDefault || false,
      parentId: category.parentId || null
    }))
  }, [categories, prompts])

  // Filter categories based on search and selection
  const filteredCategories = useMemo(() => {
    let filtered = categoriesWithCounts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'default') {
        filtered = filtered.filter(category => category.isDefault)
      } else if (selectedCategory === 'custom') {
        filtered = filtered.filter(category => !category.isDefault)
      }
    }

    return filtered
  }, [categoriesWithCounts, searchQuery, selectedCategory])

  const totalPrompts = stats.totalPrompts
  const mostPopularCategory = categoriesWithCounts.length > 0 
    ? categoriesWithCounts.reduce((prev, current) => 
        prev.promptCount > current.promptCount ? prev : current
      )
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize and manage your prompt categories
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Search and Filters - Improved with proper Select */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 h-9">
            <SelectValue placeholder="Filter categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="default">Default Only</SelectItem>
            <SelectItem value="custom">Custom Only</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? 'List' : 'Grid'}
        </Button>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={FolderOpen}
          label="Categories"
          value={stats.totalCategories}
        />
        <StatCard
          icon={Hash}
          label="Total Prompts"
          value={totalPrompts}
        />
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground">Average per Category</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {stats.totalCategories > 0 ? Math.round(totalPrompts / stats.totalCategories) : 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground">Most Popular</span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {mostPopularCategory?.name || 'None'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          workspaceSlug={workspaceSlug}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      )}

      {/* Improved Quick Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <CardDescription className="text-sm">
            Common category management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <QuickActionsSection workspaceSlug={workspaceSlug} />
        </CardContent>
      </Card>
    </div>
  )
} 