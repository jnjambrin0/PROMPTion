import { useMemo, useState } from 'react'
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
  User
} from 'lucide-react'

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

export default function PromptsTab({ workspaceSlug, workspaceData }: PromptsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const { workspace, categories, prompts, stats } = workspaceData

  // Transformar prompts reales al formato esperado
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

  // Filtrar prompts según búsqueda y categoría
  const filteredPrompts = useMemo(() => {
    return transformedPrompts.filter(prompt => {
      const matchesSearch = searchQuery === '' || 
        prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || 
        prompt.categoryId === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [transformedPrompts, searchQuery, selectedCategory])

  // Categorías reales para el filtro
  const filterCategories = useMemo(() => {
    const realCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name
    }))
    
    // Agregar "Uncategorized" si hay prompts sin categoría
    const hasUncategorized = transformedPrompts.some(p => p.categoryId === 'uncategorized')
    if (hasUncategorized) {
      realCategories.push({ id: 'uncategorized', name: 'Uncategorized' })
    }
    
    return [
      { id: 'all', name: 'All Categories' },
      ...realCategories
    ]
  }, [categories, transformedPrompts])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prompts</h2>
          <p className="text-gray-600 mt-1">
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
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          {filterCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Total Prompts</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.totalPrompts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Total Views</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {stats.totalViews}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Templates</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {stats.templatesCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Public</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {stats.publicPromptsCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {searchQuery || selectedCategory !== 'all' ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first prompt
              </p>
              <Button asChild>
                <Link href={`/${workspaceSlug}/prompts/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first prompt
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-lg line-clamp-1">{prompt.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {prompt.description}
                  </CardDescription>
              </div>
            </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{prompt.blocks} blocks</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {prompt.views} views
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {prompt.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/${workspaceSlug}/${prompt.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  )
}

export function PromptsTabSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Search and filters skeleton */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Prompts grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 