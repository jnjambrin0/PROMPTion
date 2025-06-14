'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Eye, Copy, Heart, Grid3X3, List, Search, Filter } from 'lucide-react'
import { TemplatePreviewModal } from './template-preview-modal'
import type { Template } from '@/lib/types/templates'

interface CommunityTemplatesProps {
  templates: Template[]
  searchParams: {
    view?: string
    search?: string
    category?: string
    sort?: string
    page?: string
  }
  hasMore?: boolean
  totalCount?: number
  onUseTemplate?: (templateId: string) => void
}

export function CommunityTemplates({ templates, searchParams, hasMore = false, totalCount = 0, onUseTemplate }: CommunityTemplatesProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const viewMode = searchParams.view || 'grid'
  const currentSearch = searchParams.search || ''
  const currentSort = searchParams.sort || 'popular'

  const handleViewChange = (newView: 'grid' | 'list') => {
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set('view', newView)
    router.push(`/templates?${params.toString()}`)
  }

  const handleLoadMore = () => {
    const currentPage = parseInt(searchParams.page || '1')
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set('page', (currentPage + 1).toString())
    router.push(`/templates?${params.toString()}`)
  }

  // Memoized stats
  const stats = useMemo(() => ({
    total: templates.length,
    totalUses: templates.reduce((sum, template) => sum + template.useCount, 0),
    avgRating: templates.length > 0 
      ? templates.reduce((sum, template) => sum + (template.averageScore || 0), 0) / templates.length 
      : 0
  }), [templates])

  const renderTemplateCard = (template: Template, isListView = false) => (
    <Card 
      key={template.id} 
      className={`border border-neutral-200 hover:border-neutral-300 transition-colors group ${
        isListView ? 'mb-4' : ''
      }`}
    >
      <CardContent className={isListView ? "p-4" : "p-6"}>
        <div className={`flex gap-4 ${isListView ? 'items-center' : 'items-start flex-col'}`}>
          <div className={`${isListView ? 'flex items-center gap-3 flex-1' : 'w-full'}`}>
            <div className="text-2xl">{template.icon || '📄'}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 truncate mb-1">
                {template.title}
              </h3>
              <p className={`text-sm text-neutral-600 ${isListView ? 'line-clamp-1' : 'line-clamp-2'}`}>
                {template.description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Tags and Category */}
          <div className={`flex flex-wrap gap-1 ${isListView ? 'items-center' : 'mt-3'}`}>
            {template.category && (
              <Badge variant="secondary" className="text-xs">
                {template.category.name}
              </Badge>
            )}
            {template.tags.slice(0, isListView ? 1 : 2).map((tagItem) => (
              <Badge key={tagItem.tag.id} variant="outline" className="text-xs">
                {tagItem.tag.name}
              </Badge>
            ))}
            {template.tags.length > (isListView ? 1 : 2) && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - (isListView ? 1 : 2)}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className={`flex items-center gap-4 text-xs text-neutral-600 ${isListView ? '' : 'mt-3'}`}>
            <div className="flex items-center gap-1">
              <Copy className="h-3 w-3" />
              <span>{template.useCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{template._count.favorites}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{template.viewCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Author and Actions */}
          <div className={`flex ${isListView ? 'items-center gap-4' : 'justify-between items-end mt-4'}`}>
            <div className="text-xs text-neutral-500">
              by {template.user.fullName || template.user.username || 'Anonymous'}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTemplateId(template.id)}
              >
                Preview
              </Button>
              <Button
                onClick={() => onUseTemplate?.(template.id)}
                size="sm"
                variant="outline"
              >
                <Copy className="h-3 w-3 mr-1" />
                Use
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!templates || templates.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Community Templates</h2>
          <p className="text-neutral-600">
            {currentSearch ? `No templates found for "${currentSearch}"` : 'No templates available'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Community Templates</h2>
            <p className="text-neutral-600">
              {currentSearch 
                ? `${totalCount} templates found for "${currentSearch}"`
                : `${totalCount} templates from the community`
              }
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewChange('grid')}
              className={`h-8 w-8 p-0 ${
                viewMode === 'grid' 
                  ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800' 
                  : 'hover:bg-neutral-50'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewChange('list')}
              className={`h-8 w-8 p-0 ${
                viewMode === 'list' 
                  ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800' 
                  : 'hover:bg-neutral-50'
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Templates Grid/List */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {templates.map(template => renderTemplateCard(template, true))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => renderTemplateCard(template, false))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleLoadMore}>
              Load more templates
            </Button>
          </div>
        )}
      </section>

      <TemplatePreviewModal
        templateId={selectedTemplateId}
        open={!!selectedTemplateId}
        onOpenChange={(open) => !open && setSelectedTemplateId(null)}
        onUseTemplate={onUseTemplate}
      />
    </>
  )
} 