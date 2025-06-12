'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FolderOpen, Plus, Hash, MoreHorizontal, Edit2, Trash2, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// No importamos getCategoryColorStyles ya que usaremos clases Tailwind simples

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

export default function CategoriesTab({ workspaceSlug, workspaceData }: CategoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showHierarchy, setShowHierarchy] = useState(false)

  const { workspace, categories, prompts, stats } = workspaceData

  // Transformar categorías reales con conteo de prompts
  const categoriesWithCounts = useMemo((): CategoryWithCounts[] => {
    if (!categories || categories.length === 0) return []
    
    // Contar prompts por categoría
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
      description: category.description || 'No description available',
      icon: category.icon || '📋',
      color: category.color || 'gray',
      promptCount: categoryPromptCounts.get(category.id) || 0,
      isDefault: category.isDefault || false,
      parentId: category.parentId || null
    }))
  }, [categories, prompts])

  // Filtrar categorías según búsqueda
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categoriesWithCounts
    
    return categoriesWithCounts.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [categoriesWithCounts, searchQuery])

  const totalPrompts = stats.totalPrompts

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">
            Organize and manage your prompt categories
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHierarchy(!showHierarchy)}
        >
          {showHierarchy ? 'Grid View' : 'Tree View'}
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Total Categories</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.totalCategories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Total Prompts</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totalPrompts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Average per Category</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {stats.totalCategories > 0 ? Math.round(totalPrompts / stats.totalCategories) : 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Most Popular</span>
          </div>
            <p className="text-sm font-medium mt-1">
              {categoriesWithCounts.length > 0 ? 
                categoriesWithCounts.reduce((prev, current) => 
                  prev.promptCount > current.promptCount ? prev : current
                ).name : 'None'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {searchQuery ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search query
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first category to organize your prompts
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create your first category
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      category.color === 'blue' ? 'bg-blue-100' :
                      category.color === 'green' ? 'bg-green-100' :
                      category.color === 'purple' ? 'bg-purple-100' :
                      category.color === 'orange' ? 'bg-orange-100' :
                      category.color === 'red' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        {category.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
          )}
        </div>
                      <CardDescription className="line-clamp-2">
                        {category.description}
                      </CardDescription>
      </div>
      </div>
        <Button 
          variant="ghost" 
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
                    <MoreHorizontal className="h-4 w-4" />
        </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {category.promptCount} {category.promptCount === 1 ? 'prompt' : 'prompts'}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {category.color}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
        <Button 
          size="sm" 
                      variant="outline" 
                      className="flex-1"
                      asChild
        >
                      <Link href={`/${workspaceSlug}?tab=prompts&category=${category.id}`}>
                        View Prompts
                      </Link>
        </Button>
        <Button 
          size="sm" 
                      variant="outline"
                      className="flex-1"
        >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
        </Button>
      </div>
    </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <CardDescription>
            Common category management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
            <Button variant="outline" className="justify-start">
              <FolderOpen className="h-4 w-4 mr-2" />
              Import Categories
            </Button>
            <Button variant="outline" className="justify-start">
              <Hash className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 