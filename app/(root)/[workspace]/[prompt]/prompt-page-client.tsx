'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft, Edit2, Copy, Share2, Star, MessageSquare, GitBranch, Settings, AlertCircle, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
// Skeleton import removed - using Next.js loading.tsx instead
import { PromptViewer } from '@/components/prompt/prompt-viewer'
import { getPromptPageDataAction, duplicatePromptAction, forkPromptAction, generateShareLinkAction, toggleFavoritePromptAction, checkPromptFavoriteAction } from '@/lib/actions/prompt'
import { toast } from 'sonner'

interface PromptData {
  id: string
  slug: string
  title: string
  description?: string | null
  icon?: string | null
  isTemplate: boolean
  isPublic: boolean
  isPinned: boolean
  blocks?: Record<string, unknown>[]
  variables?: Record<string, unknown>[]
  modelConfig?: Record<string, unknown>
  userId: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string | null
    fullName: string | null
    avatarUrl: string | null
  }
  category?: {
    id: string
    name: string
    color: string | null
    icon: string | null
  } | null
  workspace: {
    id: string
    name: string
    slug: string
    _count?: {
      prompts: number
    }
  }
  _count?: {
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

// Simple client-side loading for better UX

// Error Component
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-red-200">
        <CardContent className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t load this prompt. Please try again.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={onRetry} variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Link href="/">
              <Button variant="ghost">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Not Found Component
function NotFoundState({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Prompt not found
          </h3>
          <p className="text-gray-600 mb-6">
            This prompt doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <div className="flex justify-center gap-3">
            <Link href={`/${workspaceSlug}`}>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to workspace
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PromptPageClient({ workspaceSlug, promptSlug, userId }: PromptPageClientProps) {
  const router = useRouter()
  const [promptData, setPromptData] = useState<PromptData | null>(null)
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
        const transformedData: PromptData = {
          ...result.data,
          createdAt: new Date(result.data.createdAt).toISOString(),
          updatedAt: new Date(result.data.updatedAt).toISOString(),
          variables: Array.isArray(result.data.variables) ? result.data.variables : [],
          blocks: Array.isArray(result.data.blocks) ? result.data.blocks : []
        }
        setPromptData(transformedData)
        
        // Check favorite status
        const favoriteResult = await checkPromptFavoriteAction(transformedData.id)
        if (favoriteResult.success && favoriteResult.isFavorited !== undefined) {
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
      
      if (result.success && result.isFavorited !== undefined) {
        // Update local states optimistically
        setIsFavorited(result.isFavorited)
        setPromptData(prev => {
          if (!prev) return prev
          return {
            ...prev,
            _count: {
              comments: prev._count?.comments || 0,
              forks: prev._count?.forks || 0,
              blocks: prev._count?.blocks || 0,
              favorites: (prev._count?.favorites || 0) + (result.isFavorited ? 1 : -1)
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

  // Prefetching for performance optimization
  const prefetchRelatedData = useCallback(() => {
    // Prefetch edit page if user is owner
    if (isOwner) {
      router.prefetch(`/${workspaceSlug}/${promptSlug}/edit`)
    }
    // Prefetch settings page
    router.prefetch(`/${workspaceSlug}/${promptSlug}/settings`)
    // Prefetch workspace page
    if (breadcrumbData) {
      router.prefetch(`/${breadcrumbData.workspaceSlug}`)
    }
  }, [isOwner, workspaceSlug, promptSlug, router, breadcrumbData])

  // Prefetch on component mount
  useEffect(() => {
    if (promptData && !loading.initial) {
      prefetchRelatedData()
    }
  }, [promptData, loading.initial, prefetchRelatedData])

  // Optimized loading state with skeleton that mimics real content
  if (loading.initial) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-2">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-4 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
        </div>
        
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-neutral-200 rounded animate-pulse" />
                <div className="h-8 w-80 bg-neutral-200 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-96 bg-neutral-200 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-4 w-4 bg-neutral-200 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-neutral-200 rounded animate-pulse" />
              <div className="h-8 w-24 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-64 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="h-32 bg-neutral-200 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchPromptData} />
  }

  // Not found state
  if (notFound || !promptData) {
    return <NotFoundState workspaceSlug={workspaceSlug} />
  }

  // Main render
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {breadcrumbData && (
            <Link
              href={`/${breadcrumbData.workspaceSlug}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {breadcrumbData.workspaceName}
            </Link>
          )}
        </div>
        
        {/* Actions Dropdown */}
        <div className="flex items-center gap-2">
          {isOwner && (
            <Link href={`/${workspaceSlug}/${promptSlug}/edit`}>
              <Button variant="outline" size="sm" disabled={loading.action}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Prompt Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{promptData.icon || '📝'}</span>
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {promptData.title}
              </h1>
              <div className="flex items-center gap-2">
                {promptData.isTemplate && (
                  <Badge variant="secondary">Template</Badge>
                )}
                {promptData.isPublic && (
                  <Badge variant="outline">Public</Badge>
                )}
                {promptData.isPinned && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Pinned
                  </Badge>
                )}
              </div>
            </div>
            
            {promptData.description && (
              <p className="text-gray-600 mb-4">
                {promptData.description}
              </p>
            )}
            
            {/* Metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img
                  src={promptData.user.avatarUrl || `https://avatar.vercel.sh/${promptData.user.username}`}
                  alt={promptData.user.fullName || promptData.user.username || 'User'}
                  className="h-5 w-5 rounded-full"
                />
                <span>
                  {promptData.user.fullName || promptData.user.username}
                </span>
              </div>
              
              {promptData.category && (
                <div className="flex items-center gap-1">
                  <span>{promptData.category.icon}</span>
                  <span>{promptData.category.name}</span>
                </div>
              )}
              
              <span>
                Updated {formatDistanceToNow(new Date(promptData.updatedAt), { addSuffix: true })}
              </span>
              
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {promptData._count?.comments || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {promptData._count?.favorites || 0}
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  {promptData._count?.forks || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Prompt Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Prompt Content</CardTitle>
                {isOwner && (
                  <Link href={`/${workspaceSlug}/${promptSlug}/edit`}>
                    <Button variant="outline" size="sm" disabled={loading.action}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <PromptViewer prompt={{
                id: promptData.id,
                title: promptData.title,
                description: promptData.description,
                blocks: promptData.blocks || [],
                variables: Array.isArray(promptData.variables) ? promptData.variables as Record<string, unknown>[] : [],
                modelConfig: promptData.modelConfig
              }} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Variables */}
          {Array.isArray(promptData.variables) && promptData.variables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Variables</CardTitle>
                <CardDescription>
                  Input variables for this prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(promptData.variables as Record<string, unknown>[]).map((variable: Record<string, unknown>, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {variable.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {variable.type}
                        </Badge>
                      </div>
                      {variable.description && (
                        <p className="text-xs text-gray-600">
                          {variable.description}
                        </p>
                      )}
                      {variable.defaultValue && (
                        <p className="text-xs text-gray-500 mt-1">
                          Default: {variable.defaultValue}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model Configuration */}
          {promptData.modelConfig && Object.keys(promptData.modelConfig).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(promptData.modelConfig as Record<string, unknown>).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className="font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.duplicate)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.fork)}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Fork
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.share)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.favorite)}
              >
                <Star className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} style={isFavorited ? { color: '#EAB308' } : {}} />
                {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              </Button>
              {isOwner && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={loading.action}
                  onClick={() => handleAction(actions.settings)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Workspace Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workspace</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${promptData.workspace.slug}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {promptData.workspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {promptData.workspace.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {promptData.workspace._count?.prompts || 0} prompts
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 