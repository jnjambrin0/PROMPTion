'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getPromptPageDataAction, duplicatePromptAction, forkPromptAction, generateShareLinkAction, toggleFavoritePromptAction, checkPromptFavoriteAction } from '@/lib/actions/prompt'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PromptViewer } from '@/components/prompt/prompt-viewer'
import { PromptActions } from '@/components/prompt/prompt-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, ArrowLeft, Star, StarOff } from 'lucide-react'
import Link from 'next/link'
import type { JsonValue } from '@/lib/types/shared'
import Image from 'next/image'

// Tipos específicos basados en la estructura real de datos
interface PromptBlockData {
  id: string
  type: string
  content: JsonValue
  position: number
  indentLevel: number
  createdAt: Date
}

interface PromptPageData {
  id: string
  slug: string
  title: string
  description: string | null
  isPublic: boolean
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  user: {
    id: string
    username: string | null
    fullName: string | null
    avatarUrl: string | null
  }
  workspace: {
    id: string
    name: string
    slug: string
  }
  category: {
    id: string
    name: string
    color: string | null
    icon: string | null
  } | null
  blocks: PromptBlockData[]
  _count: {
    comments: number
    favorites: number
    forks: number
    blocks: number
  }
}

interface PromptPageClientProps {
  workspaceSlug: string
  promptSlug: string
  userId: string
}

interface LoadingState {
  initial: boolean
  action: boolean
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Something went wrong</h3>
              <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
            <Button onClick={onRetry} variant="outline" size="sm">
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotFoundState({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="font-semibold text-gray-900">Prompt not found</h3>
              <p className="text-sm text-gray-600 mt-1">
                This prompt doesn&apos;t exist or you don&apos;t have permission to view it.
              </p>
            </div>
            <Link href={`/${workspaceSlug}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to workspace
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Función auxiliar para convertir blocks al formato esperado por PromptViewer
function convertBlocksForViewer(blocks: PromptBlockData[]) {
  return blocks.map(block => ({
    id: block.id,
    type: block.type,
    content: typeof block.content === 'object' && block.content !== null 
      ? block.content as Record<string, unknown>
      : { text: String(block.content) },
    position: block.position,
    indentLevel: block.indentLevel
  }))
}

export function PromptPageClient({ workspaceSlug, promptSlug, userId }: PromptPageClientProps) {
  const router = useRouter()
  const [promptData, setPromptData] = useState<PromptPageData | null>(null)
  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    action: false
  })
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  // Fetch prompt data
  const fetchPromptData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }))
      setError(null)
      setNotFound(false)

      const result = await getPromptPageDataAction(workspaceSlug, promptSlug, userId)
      
      if (!result.success) {
        if (result.notFound) {
          setNotFound(true)
        } else {
          setError(result.error || 'Failed to load prompt')
        }
        return
      }

      if (result.data) {
        // Usar datos directamente sin conversiones innecesarias
        setPromptData(result.data as PromptPageData)
        
        // Check favorite status
        const favoriteResult = await checkPromptFavoriteAction(result.data.id)
        if (favoriteResult.success && typeof favoriteResult.isFavorited === 'boolean') {
          setIsFavorited(favoriteResult.isFavorited)
        }
      }
    } catch (err) {
      console.error('Error fetching prompt:', err)
      setError(err instanceof Error ? err.message : 'Failed to load prompt')
    } finally {
      setLoading(prev => ({ ...prev, initial: false }))
    }
  }, [workspaceSlug, promptSlug, userId])

  // Initial load
  useEffect(() => {
    fetchPromptData()
  }, [fetchPromptData])

  // Action handlers with loading states
  const handleAction = useCallback(async (action: () => Promise<void>) => {
    try {
      setLoading(prev => ({ ...prev, action: true }))
      await action()
    } catch (err) {
      console.error('Action failed:', err)
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(prev => ({ ...prev, action: false }))
    }
  }, [])

  // Memoized computed values
  const isOwner = useMemo(() => {
    return promptData ? promptData.userId === userId : false
  }, [promptData, userId])

  const breadcrumbData = useMemo(() => {
    if (!promptData) return null
    return {
      workspaceName: promptData.workspace.name,
      workspaceSlug: promptData.workspace.slug
    }
  }, [promptData])

  // Action functions with real implementations
  const actions = useMemo(() => ({
    duplicate: async () => {
      if (!promptData) return
      
      const result = await duplicatePromptAction(promptData.id, workspaceSlug)
      
      if (result.success && result.promptSlug && result.workspaceSlug) {
        toast.success("Prompt duplicated successfully", {
          description: "You've been redirected to the duplicated prompt",
        })
        router.push(`/${result.workspaceSlug}/${result.promptSlug}`)
      } else {
        toast.error("Failed to duplicate prompt", {
          description: result.error || "Unknown error occurred",
        })
      }
    },
    
    fork: async () => {
      if (!promptData) return
      
      const result = await forkPromptAction(promptData.id)
      
      if (result.success && result.promptSlug && result.workspaceSlug) {
        toast.success("Prompt forked successfully", {
          description: "You've been redirected to the forked prompt",
        })
        router.push(`/${result.workspaceSlug}/${result.promptSlug}`)
      } else {
        toast.error("Failed to fork prompt", {
          description: result.error || "Unknown error occurred",
        })
      }
    },
    
    share: async () => {
      if (!promptData) return
      
      const result = await generateShareLinkAction(promptData.id)
      
      if (result.success && result.shareUrl) {
        try {
          await navigator.clipboard.writeText(result.shareUrl)
          toast.success("Share link copied to clipboard", {
            description: result.isPublic 
              ? "Anyone with this link can view the prompt" 
              : "Only workspace members can view this prompt",
          })
        } catch {
          // Fallback for browsers that don't support clipboard API
          toast.success("Share link generated", {
            description: `Link: ${result.shareUrl}`,
          })
        }
      } else {
        toast.error("Failed to generate share link", {
          description: result.error || "Unknown error occurred",
        })
      }
    },
    
    favorite: async () => {
      if (!promptData) return
      
      const result = await toggleFavoritePromptAction(promptData.id)
      
      if (result.success && typeof result.isFavorited === 'boolean') {
        // Update local states optimistically
        setIsFavorited(result.isFavorited)
        setPromptData(prev => {
          if (!prev) return prev
          return {
            ...prev,
            _count: {
              ...prev._count,
              favorites: prev._count.favorites + (result.isFavorited ? 1 : -1)
            }
          }
        })
        
        toast.success(result.isFavorited ? "Added to favorites" : "Removed from favorites", {
          description: result.isFavorited 
            ? "This prompt has been added to your favorites" 
            : "This prompt has been removed from your favorites",
        })
      } else {
        toast.error("Failed to update favorites", {
          description: result.error || "Unknown error occurred",
        })
      }
    },
    
    settings: async () => {
      router.push(`/${workspaceSlug}/${promptSlug}/settings`)
    }
  }), [workspaceSlug, promptSlug, router, promptData])

  // Loading state
  if (loading.initial) {
    return <LoadingSkeleton />
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchPromptData} />
  }

  // Not found state
  if (notFound) {
    return <NotFoundState workspaceSlug={workspaceSlug} />
  }

  // No data state
  if (!promptData) {
    return <ErrorState message="No prompt data available" onRetry={fetchPromptData} />
  }

  // Preparar datos para PromptViewer
  const promptViewerData = {
    id: promptData.id,
    title: promptData.title,
    description: promptData.description,
    blocks: convertBlocksForViewer(promptData.blocks || [])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumbs */}
        {breadcrumbData && (
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href={`/${breadcrumbData.workspaceSlug}`} className="hover:text-gray-900">
                {breadcrumbData.workspaceName}
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-900">{promptData.title}</span>
            </div>
          </nav>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Prompt header with actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{promptData.title}</h1>
                    {promptData.description && (
                      <p className="text-gray-600">{promptData.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {/* Favorite button */}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading.action}
                      onClick={() => handleAction(actions.favorite)}
                      className="flex items-center gap-2"
                    >
                      {isFavorited ? (
                        <>
                          <StarOff className="h-4 w-4" />
                          Unfavorite
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4" />
                          Favorite
                        </>
                      )}
                    </Button>
                    
                    {/* Actions dropdown */}
                    <PromptActions
                      promptId={promptData.id}
                      promptSlug={promptData.slug}
                      workspaceSlug={workspaceSlug}
                      isOwner={isOwner}
                      isFavorited={isFavorited}
                      onFavoriteChange={setIsFavorited}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt viewer */}
            <Card>
              <CardContent className="pt-6">
                <PromptViewer prompt={promptViewerData} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prompt info */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">About this prompt</h3>
                    {promptData.description ? (
                      <p className="text-sm text-gray-600">{promptData.description}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No description available</p>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Created</span>
                      <p className="font-medium">{new Date(promptData.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated</span>
                      <p className="font-medium">{new Date(promptData.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {promptData._count && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-lg">{promptData._count.blocks || 0}</p>
                          <p className="text-gray-500">Blocks</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-lg">{promptData._count.favorites || 0}</p>
                          <p className="text-gray-500">Favorites</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-lg">{promptData._count.forks || 0}</p>
                          <p className="text-gray-500">Forks</p>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    {promptData.isTemplate && (
                      <Badge variant="secondary">Template</Badge>
                    )}
                    {promptData.isPublic && (
                      <Badge variant="outline">Public</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Created by</h3>
                <div className="flex items-center space-x-3">
                  {promptData.user.avatarUrl ? (
                    <Image
                      src={promptData.user.avatarUrl}
                      alt={promptData.user.fullName || promptData.user.username || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {(promptData.user.fullName || promptData.user.username || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {promptData.user.fullName || promptData.user.username || 'Anonymous'}
                    </p>
                    {promptData.user.username && promptData.user.fullName && (
                      <p className="text-sm text-gray-500">@{promptData.user.username}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 