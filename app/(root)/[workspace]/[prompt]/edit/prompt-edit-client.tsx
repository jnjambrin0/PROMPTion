'use client'

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, EyeOff, Clock, Users, Settings, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { VersionHistoryPanel } from '@/components/ui/version-history-panel'
import { useDebounce } from '@/hooks/use-debounce'

// Types for edit form - based on our database schema
interface PromptEditData {
  title: string
  description: string
  isPublic: boolean
  isTemplate: boolean
  variables: Array<{
    name: string
    description: string
    required: boolean
  }>
}

interface Workspace {
  id: string
  name: string
  slug: string
}

interface Prompt {
  id: string
  title: string
  slug: string
  description?: string | null
  isPublic: boolean
  isTemplate: boolean
  variables: any // JSON field
  workspace: Workspace
  createdAt: Date
  updatedAt: Date
}

interface PromptEditClientProps {
  workspaceSlug: string
  promptSlug: string
  userId: string
  initialPrompt?: Prompt | null
  initialWorkspace?: Workspace | null
}

interface SaveState {
  status: 'saved' | 'saving' | 'unsaved' | 'error'
  lastSaved?: Date
  error?: string
}

// Auto-save indicator component
function AutoSaveIndicator({ saveState }: { saveState: SaveState }) {
  const { status, lastSaved, error } = saveState

  const icons = {
    saved: <span className="text-green-600">✓</span>,
    saving: <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>,
    unsaved: <Clock className="h-3 w-3 text-yellow-600" />,
    error: <AlertTriangle className="h-3 w-3 text-red-600" />
  }

  const messages = {
    saved: `Saved ${lastSaved ? lastSaved.toLocaleTimeString() : ''}`,
    saving: 'Saving...',
    unsaved: 'Unsaved changes',
    error: error || 'Save failed'
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {icons[status]}
      <span className={`${
        status === 'error' ? 'text-red-600' : 
        status === 'unsaved' ? 'text-yellow-600' : 
        'text-neutral-600'
      }`}>
        {messages[status]}
      </span>
    </div>
  )
}

// Unsaved changes warning dialog
function UnsavedChangesDialog({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
          <h3 className="font-semibold text-neutral-900">Unsaved changes</h3>
        </div>
        <p className="text-neutral-600 mb-6">
          You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Leave without saving
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PromptEditClient({ 
  workspaceSlug, 
  promptSlug, 
  userId,
  initialPrompt = null,
  initialWorkspace = null
}: PromptEditClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(!initialPrompt)
  const [previewMode, setPreviewMode] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  
  const [saveState, setSaveState] = useState<SaveState>({
    status: 'saved'
  })
  
  // Form data state
  const [formData, setFormData] = useState<PromptEditData>({
    title: initialPrompt?.title || '',
    description: initialPrompt?.description || '',
    isPublic: initialPrompt?.isPublic || false,
    isTemplate: initialPrompt?.isTemplate || false,
    variables: Array.isArray(initialPrompt?.variables) ? initialPrompt.variables : []
  })

  // Track initial state for change detection
  const [initialData, setInitialData] = useState<PromptEditData | null>(
    initialPrompt ? {
      title: initialPrompt.title,
      description: initialPrompt.description || '',
      isPublic: initialPrompt.isPublic,
      isTemplate: initialPrompt.isTemplate,
      variables: Array.isArray(initialPrompt.variables) ? initialPrompt.variables : []
    } : null
  )

  // Workspace and prompt metadata
  const [workspace, setWorkspace] = useState<Workspace | null>(
    initialWorkspace || initialPrompt?.workspace || null
  )
  const [prompt, setPrompt] = useState<Prompt | null>(initialPrompt)

  // Debounced form data for auto-save
  const debouncedFormData = useDebounce(formData, 2000)

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!initialData) return false
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Auto-save effect with debounce
  useEffect(() => {
    if (!isLoading && initialData && hasUnsavedChanges && prompt) {
      handleAutoSave()
    }
  }, [debouncedFormData, isLoading, initialData, hasUnsavedChanges, prompt])

  // Handle browser navigation/refresh with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Load data if not provided initially
  useEffect(() => {
    if (!initialPrompt && !isLoading) {
      loadPromptData()
    } else if (initialPrompt) {
      setIsLoading(false)
      setSaveState({ status: 'saved', lastSaved: new Date(initialPrompt.updatedAt) })
    }
  }, [workspaceSlug, promptSlug, initialPrompt])

  const loadPromptData = async () => {
    try {
      setIsLoading(true)
      
      // TODO: Implement actual API call to fetch prompt data
      // This would be replaced with a proper API call
      const response = await fetch(`/api/workspaces/${workspaceSlug}/prompts/${promptSlug}`)
      
      if (!response.ok) {
        throw new Error('Failed to load prompt data')
      }
      
      const data = await response.json()
      
      setPrompt(data.prompt)
      setWorkspace(data.workspace)
      
      const promptData: PromptEditData = {
        title: data.prompt.title,
        description: data.prompt.description || '',
        isPublic: data.prompt.isPublic,
        isTemplate: data.prompt.isTemplate,
        variables: Array.isArray(data.prompt.variables) ? data.prompt.variables : []
      }
      
      setFormData(promptData)
      setInitialData(promptData)
      setSaveState({ status: 'saved', lastSaved: new Date(data.prompt.updatedAt) })
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading prompt data:', error)
      toast.error('Failed to load prompt data')
      setSaveState({ status: 'error', error: 'Failed to load data' })
      setIsLoading(false)
    }
  }

  const handleAutoSave = useCallback(async () => {
    if (saveState.status === 'saving' || !prompt) return

    setSaveState({ status: 'saving' })
    
    try {
      // TODO: Implement actual save logic with API call
      const response = await fetch(`/api/workspaces/${workspaceSlug}/prompts/${promptSlug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }
      
      const newSaveState: SaveState = { 
        status: 'saved', 
        lastSaved: new Date() 
      }
      setSaveState(newSaveState)
      
      // Update initial data to match current state
      setInitialData({ ...formData })
    } catch (error) {
      console.error('Auto-save failed:', error)
      setSaveState({ 
        status: 'error', 
        error: 'Auto-save failed' 
      })
    }
  }, [formData, saveState.status, prompt, workspaceSlug, promptSlug])

  const handleManualSave = useCallback(() => {
    startTransition(async () => {
      try {
        setSaveState({ status: 'saving' })
        
        // TODO: Implement actual save logic with API call
        const response = await fetch(`/api/workspaces/${workspaceSlug}/prompts/${promptSlug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to save')
        }
        
        const newSaveState: SaveState = { 
          status: 'saved', 
          lastSaved: new Date() 
        }
        setSaveState(newSaveState)
        setInitialData({ ...formData })
        toast.success('Prompt saved successfully')
      } catch (error) {
        console.error('Save failed:', error)
        setSaveState({ 
          status: 'error', 
          error: 'Failed to save prompt' 
        })
        toast.error('Failed to save prompt')
      }
    })
  }, [formData, workspaceSlug, promptSlug])

  const updateFormData = useCallback((updates: Partial<PromptEditData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setSaveState(prev => ({ ...prev, status: 'unsaved' }))
  }, [])

  // Handle navigation with unsaved changes
  const handleNavigation = useCallback((path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path)
      setShowUnsavedDialog(true)
    } else {
      router.push(path)
    }
  }, [hasUnsavedChanges, router])

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
    setShowUnsavedDialog(false)
    setPendingNavigation(null)
  }, [pendingNavigation, router])

  const cancelNavigation = useCallback(() => {
    setShowUnsavedDialog(false)
    setPendingNavigation(null)
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="h-16 bg-neutral-200 rounded mb-6"></div>
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!prompt || !workspace) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-neutral-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Prompt not found</h2>
          <p className="mb-4">The prompt you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild variant="outline">
            <Link href={`/${workspaceSlug}`}>
              Back to workspace
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigation(`/${workspaceSlug}/${promptSlug}`)}
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to prompt
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-neutral-900">Edit Prompt</h1>
              <Badge variant="secondary" className="text-xs">
                {workspace.name}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AutoSaveIndicator saveState={saveState} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="gap-2"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              onClick={handleManualSave}
              disabled={isPending || saveState.status === 'saving' || !hasUnsavedChanges}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <Separator />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the title and description of your prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="Enter prompt title"
                    className="text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Describe what this prompt does"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="isPublic">Public</Label>
                    <p className="text-xs text-neutral-500">
                      Allow anyone to view this prompt
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => updateFormData({ isPublic: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="isTemplate">Template</Label>
                    <p className="text-xs text-neutral-500">
                      Make available as a template
                    </p>
                  </div>
                  <Switch
                    id="isTemplate"
                    checked={formData.isTemplate}
                    onCheckedChange={(checked) => updateFormData({ isTemplate: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Variables */}
            <Card>
              <CardHeader>
                <CardTitle>Variables</CardTitle>
                <CardDescription>
                  Detected variables in your prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.variables.length > 0 ? (
                  <div className="space-y-3">
                    {formData.variables.map((variable, index) => (
                      <div key={index} className="p-3 border border-neutral-200 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                            {'{{'}{variable.name}{'}}'}
                          </code>
                          <Badge variant={variable.required ? "default" : "secondary"} className="text-xs">
                            {variable.required ? 'Required' : 'Optional'}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-600">
                          {variable.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4">
                    No variables detected
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => handleNavigation(`/${workspaceSlug}/${promptSlug}/settings`)}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Advanced Settings
                  </Button>
                </button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Manage Collaborators
                </Button>
                {prompt && (
                  <VersionHistoryPanel 
                    promptId={prompt.id}
                    onRestoreVersion={async (versionId) => {
                      // TODO: Implement restore version logic
                      toast.success('Version restored successfully')
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  )
} 