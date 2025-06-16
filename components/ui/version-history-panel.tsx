'use client'

import { useState, useCallback, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Clock, RotateCcw, Eye, GitBranch, User, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { ScrollArea } from './scroll-area'
import { Separator } from './separator'
import { Badge } from './badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { toast } from 'sonner'

interface Version {
  id: string
  version: string
  timestamp: Date
  author: {
    name: string
    email: string
  }
  changes: {
    type: 'content' | 'settings' | 'variables'
    description: string
  }[]
  isCurrent: boolean
}

interface VersionHistoryPanelProps {
  promptId: string
  onRestoreVersion?: (versionId: string) => Promise<void>
}

interface LoadingState {
  restoring: Set<string>
  previewing: Set<string>
  fetching: boolean
}

// Demo version history data
const DEMO_VERSIONS: Version[] = [
  {
    id: '1',
    version: '1.3.0',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    author: { name: 'You', email: 'you@example.com' },
    changes: [
      { type: 'content', description: 'Updated prompt content with better instructions' },
      { type: 'variables', description: 'Added new variable: tone' }
    ],
    isCurrent: true
  },
  {
    id: '2',
    version: '1.2.1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    author: { name: 'Sarah Chen', email: 'sarah@example.com' },
    changes: [
      { type: 'settings', description: 'Changed visibility to public' }
    ],
    isCurrent: false
  },
  {
    id: '3',
    version: '1.2.0',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    author: { name: 'You', email: 'you@example.com' },
    changes: [
      { type: 'content', description: 'Major rewrite of prompt structure' },
      { type: 'variables', description: 'Removed unused variables' },
      { type: 'settings', description: 'Updated AI model to GPT-4o' }
    ],
    isCurrent: false
  },
  {
    id: '4',
    version: '1.1.0',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    author: { name: 'John Miller', email: 'john@example.com' },
    changes: [
      { type: 'content', description: 'Added examples section' }
    ],
    isCurrent: false
  },
  {
    id: '5',
    version: '1.0.0',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    author: { name: 'You', email: 'you@example.com' },
    changes: [
      { type: 'content', description: 'Initial version' }
    ],
    isCurrent: false
  }
]

const getChangeIcon = (type: Version['changes'][0]['type']) => {
  const iconMap = {
    content: <GitBranch className="h-3 w-3 text-blue-600" />,
    settings: <Clock className="h-3 w-3 text-orange-600" />,
    variables: <Eye className="h-3 w-3 text-green-600" />,
  }
  return iconMap[type] || <GitBranch className="h-3 w-3 text-neutral-600" />
}

function VersionItem({ 
  version, 
  onRestore,
  onPreview,
  isRestoring,
  isPreviewing
}: { 
  version: Version
  onRestore?: (versionId: string) => Promise<void>
  onPreview?: (versionId: string) => Promise<void>
  isRestoring: boolean
  isPreviewing: boolean
}) {
  const changesSummary = useMemo(() => {
    const types = version.changes.map(c => c.type)
    const uniqueTypes = [...new Set(types)]
    return uniqueTypes.join(', ')
  }, [version.changes])

  return (
    <div className={`p-3 border rounded-md transition-colors ${
      version.isCurrent 
        ? 'border-blue-200 bg-blue-50/30' 
        : 'border-neutral-200 hover:bg-neutral-50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={version.isCurrent ? "default" : "secondary"} className="text-xs">
            v{version.version}
          </Badge>
          {version.isCurrent && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
              Current
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onPreview?.(version.id)}
            disabled={isPreviewing}
            title="Preview version"
          >
            {isPreviewing ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
            ) : (
            <Eye className="h-3 w-3" />
            )}
          </Button>
          {!version.isCurrent && onRestore && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onRestore(version.id)}
              disabled={isRestoring}
              title="Restore this version"
            >
              {isRestoring ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
              ) : (
              <RotateCcw className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <User className="h-3 w-3" />
          <span>{version.author.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(version.timestamp, { addSuffix: true })}</span>
          <span>•</span>
          <span className="text-neutral-500 capitalize">{changesSummary}</span>
        </div>
        
        <div className="space-y-1">
          {version.changes.map((change, index) => (
            <div key={index} className="flex items-start gap-2 text-xs">
              {getChangeIcon(change.type)}
              <span className="text-neutral-700 flex-1">{change.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-3 border border-neutral-200 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-12 bg-neutral-200 rounded animate-pulse" />
              <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-1">
              <div className="h-6 w-6 bg-neutral-200 rounded animate-pulse" />
              <div className="h-6 w-6 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-48 bg-neutral-200 rounded animate-pulse" />
            <div className="h-3 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-6">
      <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-3" />
      <h3 className="text-sm font-medium text-neutral-900 mb-2">
        Failed to load version history
      </h3>
      <p className="text-xs text-neutral-500 mb-4">
        There was an error loading the version history.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

export function VersionHistoryPanel({ onRestoreVersion }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loadingState, setLoadingState] = useState<LoadingState>({
    restoring: new Set(),
    previewing: new Set(),
    fetching: false
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch versions when dialog opens
  const fetchVersions = useCallback(async () => {
    setLoadingState(prev => ({ ...prev, fetching: true }))
    setError(null)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setVersions(DEMO_VERSIONS)
    } catch (err) {
      console.error('Failed to fetch versions:', err)
      setError('Failed to load version history')
    } finally {
      setLoadingState(prev => ({ ...prev, fetching: false }))
    }
  }, [])

  // Load versions when panel opens
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (open && versions.length === 0) {
      fetchVersions()
    }
  }, [versions.length, fetchVersions])

  const handleRestore = useCallback(async (versionId: string) => {
    if (!onRestoreVersion) return

    setLoadingState(prev => ({
      ...prev,
      restoring: new Set([...prev.restoring, versionId])
    }))

    try {
      await onRestoreVersion(versionId)
      toast.success('Version restored successfully')
      
      // Update current version in local state
      setVersions(prev => prev.map(v => ({
        ...v,
        isCurrent: v.id === versionId
      })))
    } catch (err) {
      console.error('Failed to restore version:', err)
      toast.error('Failed to restore version')
    } finally {
      setLoadingState(prev => ({
        ...prev,
        restoring: new Set([...prev.restoring].filter(id => id !== versionId))
      }))
    }
  }, [onRestoreVersion])

  const handlePreview = useCallback(async (versionId: string) => {
    setLoadingState(prev => ({
      ...prev,
      previewing: new Set([...prev.previewing, versionId])
    }))

    try {
      // TODO: Implement preview logic
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Preview opened')
    } catch (err) {
      console.error('Failed to preview version:', err)
      toast.error('Failed to preview version')
    } finally {
      setLoadingState(prev => ({
        ...prev,
        previewing: new Set([...prev.previewing].filter(id => id !== versionId))
      }))
    }
  }, [])

  const currentVersion = useMemo(() => 
    versions.find(v => v.isCurrent), 
    [versions]
  )

  const totalVersions = useMemo(() => versions.length, [versions])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          Version History
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View and restore previous versions of this prompt
            {currentVersion && (
              <span className="block mt-1 text-xs text-neutral-500">
                Current: v{currentVersion.version}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-96 -mx-6 px-6">
          {loadingState.fetching ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState onRetry={fetchVersions} />
          ) : (
          <div className="space-y-3">
            {versions.map((version) => (
              <VersionItem
                key={version.id}
                version={version}
                  onRestore={handleRestore}
                  onPreview={handlePreview}
                  isRestoring={loadingState.restoring.has(version.id)}
                  isPreviewing={loadingState.previewing.has(version.id)}
              />
            ))}
          </div>
          )}
        </ScrollArea>
        
        <Separator />
        
        <div className="flex justify-between text-xs text-neutral-500">
          <span>{totalVersions} versions</span>
          <span>Showing last 30 days</span>
        </div>
      </DialogContent>
    </Dialog>
  )
} 