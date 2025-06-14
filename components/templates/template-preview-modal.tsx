'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User, Calendar, Copy, Heart, Eye, X, ExternalLink, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'
import type { Template } from '@/lib/types/templates'

// ==================== TIPOS E INTERFACES ====================

interface TemplatePreviewModalProps {
  templateId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUseTemplate?: (templateId: string) => void
}

interface LoadingState {
  initial: boolean
  action: boolean
}

interface ErrorState {
  message: string | null
  hasRetry: boolean
}

// ==================== COMPONENTES DE LOADING Y ERROR ====================

function ModalSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="h-12 w-12 bg-neutral-200 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-full" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-neutral-200 rounded animate-pulse" />
        <div className="h-24 bg-neutral-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

function ErrorDisplay({ message, onRetry, onClose }: { 
  message: string
  onRetry?: () => void
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-center h-96 p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Failed to load template
        </h3>
        <p className="text-neutral-600 mb-4">{message}</p>
        <div className="flex justify-center gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try again
            </Button>
          )}
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// ==================== COMPONENTE PRINCIPAL ====================

export function TemplatePreviewModal({ 
  templateId, 
  open, 
  onOpenChange, 
  onUseTemplate 
}: TemplatePreviewModalProps) {
  // Estados optimizados
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState<LoadingState>({
    initial: false,
    action: false
  })
  const [error, setError] = useState<ErrorState>({
    message: null,
    hasRetry: false
  })

  // ==================== DATA FETCHING VIA API ====================

  const loadTemplate = useCallback(async (id: string) => {
    setLoading(prev => ({ ...prev, initial: true }))
    setError({ message: null, hasRetry: false })
    setTemplate(null)
    
    try {
      const { getTemplateByIdAction } = await import('@/lib/actions/templates')
      const result = await getTemplateByIdAction(id)

      if (!result.success) {
        setError({
          message: result.error || 'Failed to load template',
          hasRetry: Boolean(result.error?.includes('network') || result.error?.includes('server'))
        })
        return
      }

      if (result.data) {
        setTemplate(result.data)
      } else {
        setError({
          message: 'Template not found or not accessible',
          hasRetry: false
        })
      }
    } catch (err) {
      console.error('Error loading template:', err)
      setError({
        message: err instanceof Error ? err.message : 'Network error occurred',
        hasRetry: true
      })
    } finally {
      setLoading(prev => ({ ...prev, initial: false }))
    }
  }, [])

  const handleRetry = useCallback(() => {
    if (templateId) {
      loadTemplate(templateId)
    }
  }, [templateId, loadTemplate])

  // ==================== EFFECTS OPTIMIZADOS ====================

  useEffect(() => {
    if (open && templateId) {
      loadTemplate(templateId)
    } else if (!open) {
      // Cleanup cuando se cierra el modal
      setTemplate(null)
      setError({ message: null, hasRetry: false })
      setLoading({ initial: false, action: false })
    }
  }, [open, templateId, loadTemplate])

  // ==================== HANDLERS DE ACCIONES ====================

  const handleUseTemplate = useCallback(async () => {
    if (!template || !onUseTemplate) return

    setLoading(prev => ({ ...prev, action: true }))
    try {
      await onUseTemplate(template.id)
      onOpenChange(false)
    } catch (err) {
      console.error('Error using template:', err)
      // El error será manejado por el componente padre
    } finally {
      setLoading(prev => ({ ...prev, action: false }))
    }
  }, [template, onUseTemplate, onOpenChange])

  const handleExternalView = useCallback(() => {
    if (template) {
      window.open(`/templates/${template.id}`, '_blank')
    }
  }, [template])

  // ==================== RENDER MEMOIZADO ====================

  const renderContent = useMemo(() => {
    if (loading.initial) {
      return <ModalSkeleton />
    }

    if (error.message) {
      return (
        <ErrorDisplay
          message={error.message}
          onRetry={error.hasRetry ? handleRetry : undefined}
          onClose={() => onOpenChange(false)}
        />
      )
    }

    if (!template) {
      return (
        <ErrorDisplay
          message="Template not found"
          onClose={() => onOpenChange(false)}
        />
      )
    }

    return (
      <>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="text-4xl">{template.icon || '📄'}</div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-semibold text-neutral-900 mb-2">
                  {template.title}
                </DialogTitle>
                {template.description && (
                  <p className="text-neutral-600 mb-3">{template.description}</p>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="capitalize">
                    Template
                  </Badge>
                  {template.category && (
                    <Badge variant="secondary">
                      {template.category.name}
                    </Badge>
                  )}
                  {template.tags.slice(0, 3).map((tagItem) => (
                    <Badge key={tagItem.tag.id} variant="secondary">
                      {tagItem.tag.name}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary">
                      +{template.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Copy className="h-4 w-4" />
                    <span>{template.useCount.toLocaleString()} uses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{template._count.favorites} favorites</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{template.viewCount.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                <User className="h-5 w-5 text-neutral-600" />
              </div>
              <div>
                <div className="font-medium text-neutral-900">
                  {template.user.fullName || template.user.username || 'Anonymous'}
                </div>
                <div className="text-sm text-neutral-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {formatDistanceToNow(template.createdAt)} ago
                </div>
              </div>
            </div>

            {/* Template Content Preview */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 mb-3">Template Preview</h3>
              <div className="text-sm text-neutral-600">
                <p>This template includes:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Pre-configured prompt structure</li>
                  <li>Optimized AI model settings</li>
                  <li>Reusable content blocks</li>
                  <li>Variable placeholders for customization</li>
                </ul>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 mb-2">How to use this template</h3>
              <div className="text-sm text-neutral-600 space-y-2">
                <p>1. Click "Use Template" to create a copy in your workspace</p>
                <p>2. Customize the content and variables to fit your needs</p>
                <p>3. Test and iterate on the prompt for best results</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4">
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading.action}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUseTemplate}
              className="flex-1"
              variant="outline"
              disabled={loading.action}
            >
              {loading.action ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Using...
                </div>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExternalView}
              disabled={loading.action}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </>
    )
  }, [
    loading, 
    error, 
    template, 
    handleRetry, 
    onOpenChange, 
    handleUseTemplate, 
    handleExternalView
  ])

  // ==================== RENDER PRINCIPAL ====================

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        {renderContent}
      </DialogContent>
    </Dialog>
  )
} 