'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Copy, Heart, Star } from 'lucide-react'
import { TemplatePreviewModal } from './template-preview-modal'
import type { Template } from '@/lib/types/templates'

interface FeaturedTemplatesProps {
  templates: Template[]
  onUseTemplate?: (templateId: string) => void
}

export function FeaturedTemplates({ templates, onUseTemplate }: FeaturedTemplatesProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  if (!templates || templates.length === 0) {
    return null
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-neutral-900">Featured Templates</h2>
          <Badge variant="secondary" className="ml-2">Popular</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="border border-neutral-200 hover:border-neutral-300 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-2xl">{template.icon || '📄'}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate mb-1">
                      {template.title}
                    </h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {template.description || 'No description available'}
                    </p>
                  </div>
                </div>

                {/* Category and Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.category && (
                    <Badge variant="secondary" className="text-xs">
                      {template.category.name}
                    </Badge>
                  )}
                  {template.tags.slice(0, 2).map((tagItem) => (
                    <Badge key={tagItem.tag.id} variant="outline" className="text-xs">
                      {tagItem.tag.name}
                    </Badge>
                  ))}
                  {template.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-neutral-600 mb-4">
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

                {/* Author */}
                <div className="text-xs text-neutral-500">
                  by {template.user.fullName || template.user.username || 'Anonymous'}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                  <Button
                    onClick={() => onUseTemplate?.(template.id)}
                    className="flex-1"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Use
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
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