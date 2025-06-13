'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Settings, ChevronDown, ChevronUp, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { getPromptPageDataAction, updatePromptAction } from '@/lib/actions/prompt'
import { SimpleEditor, PreviewPanel } from '@/components/prompt-editor'
import { PreviewPopup } from '@/components/prompt-editor/preview-popup'
import { AdvancedEditor } from '@/components/prompt-editor/advanced-editor'

// Simplified types for basic editing
// Enhanced types for advanced mode
interface Variable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  description: string
  required: boolean
  defaultValue?: string
  options?: string[]
}

interface Block {
  id: string
  type: 'TEXT' | 'VARIABLE' | 'PROMPT' | 'HEADING' | 'CODE'
  position: number
  content: {
    text?: string
    level?: number
    language?: string
    variable?: Variable
  }
}

interface PromptEditData {
  title: string
  description: string
  content: string // Single content field for simple mode
  blocks: Block[] // Advanced mode blocks
  isPublic: boolean
  isTemplate: boolean
}

interface PromptEditClientProps {
  workspaceSlug: string
  promptSlug: string
  userId: string
  initialPrompt?: any
  initialWorkspace?: any
}

interface LoadingState {
  initial: boolean
  saving: boolean
}

export function PromptEditClient({ 
  workspaceSlug, 
  promptSlug, 
  userId,
  initialPrompt,
  initialWorkspace
}: PromptEditClientProps) {
  const router = useRouter()
  
  // State management
  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    saving: false
  })
  
  const [formData, setFormData] = useState<PromptEditData>({
    title: '',
    description: '',
    content: '',
    blocks: [],
    isPublic: false,
    isTemplate: false
  })
  
  const [originalData, setOriginalData] = useState<PromptEditData | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [promptData, setPromptData] = useState<any>(null)

  // Check for unsaved changes
  const hasChanges = useMemo(() => {
    if (!originalData) return false
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }, [formData, originalData])

  // Convert blocks to simple content and vice versa
  const blocksToContent = useCallback((blocks: any[]): string => {
    if (!Array.isArray(blocks)) return ''
    
    return blocks
      .filter(block => block.type === 'TEXT' || block.type === 'PROMPT')
      .map(block => block.content?.text || '')
      .join('\n\n')
      .trim()
  }, [])

  const contentToBlocks = useCallback((content: string): Block[] => {
    if (!content.trim()) return []
    
    // Simple conversion: split by double newlines and create text blocks
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    
    return paragraphs.map((text, index): Block => ({
      id: `block-${Date.now()}-${index}`,
      type: 'TEXT' as const,
      position: index,
      content: { text: text.trim() }
    }))
  }, [])

  // Load initial data
  const fetchPromptData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }))
      
      const result = await getPromptPageDataAction(workspaceSlug, promptSlug, userId)
      
      if (!result.success) {
        toast.error(result.error || 'Failed to load prompt')
        return
      }

      if (result.data) {
        const data = result.data
        
        // Convert blocks to simple content for editing
        const content = blocksToContent(data.blocks || [])
        
        const initialFormData: PromptEditData = {
          title: data.title,
          description: data.description || '',
          content,
          blocks: [], // Will be populated when switching to advanced mode
          isPublic: data.isPublic,
          isTemplate: data.isTemplate
        }
        
        setFormData(initialFormData)
        setOriginalData(initialFormData)
        setPromptData(data)
      }
    } catch (error) {
      console.error('Error loading prompt:', error)
      toast.error('Failed to load prompt')
    } finally {
      setLoading(prev => ({ ...prev, initial: false }))
    }
  }, [workspaceSlug, promptSlug, userId, blocksToContent])

  // Save changes
  const handleSave = useCallback(async () => {
    if (!promptData || loading.saving) return
    
    try {
      setLoading(prev => ({ ...prev, saving: true }))
      
      // Convert content back to blocks for storage
      const blocks = contentToBlocks(formData.content)
      
      const result = await updatePromptAction(promptData.id, {
        title: formData.title,
        description: formData.description,
        blocks,
        isPublic: formData.isPublic,
        isTemplate: formData.isTemplate
      })
      
      if (result.success) {
        setOriginalData({ ...formData })
        toast.success('Prompt saved successfully')
      } else {
        toast.error(result.error || 'Failed to save prompt')
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast.error('Failed to save prompt')
    } finally {
      setLoading(prev => ({ ...prev, saving: false }))
    }
  }, [formData, promptData, loading.saving, contentToBlocks])

  // Handle navigation with unsaved changes
  const handleBack = useCallback(() => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push(`/${workspaceSlug}/${promptSlug}`)
      }
    } else {
      router.push(`/${workspaceSlug}/${promptSlug}`)
    }
  }, [hasChanges, router, workspaceSlug, promptSlug])

  // Toggle advanced mode
  const toggleAdvancedMode = useCallback(() => {
    if (hasChanges) {
      toast.error('Please save your changes before switching modes')
      return
    }
    
    if (isAdvancedMode) {
      // Switch back to simple mode - convert blocks to content
      const content = blocksToContent(formData.blocks)
      setFormData(prev => ({ ...prev, content, blocks: [] }))
      setIsAdvancedMode(false)
      toast.success('Switched to simple mode')
    } else {
      // Switch to advanced mode - convert content to blocks
      const blocks = contentToBlocks(formData.content)
      setFormData(prev => ({ ...prev, blocks, content: '' }))
      setIsAdvancedMode(true)
      toast.success('Switched to advanced mode')
    }
  }, [hasChanges, isAdvancedMode, formData.blocks, formData.content, blocksToContent, contentToBlocks])

  // Handle back to simple from advanced editor
  const handleBackToSimple = useCallback(() => {
    if (hasChanges) {
      toast.error('Please save your changes before switching modes')
      return
    }
    
    const content = blocksToContent(formData.blocks)
    setFormData(prev => ({ ...prev, content, blocks: [] }))
    setIsAdvancedMode(false)
    toast.success('Switched to simple mode')
  }, [hasChanges, formData.blocks, blocksToContent])

  // Load data on mount
  useEffect(() => {
    fetchPromptData()
  }, [fetchPromptData])

  // Browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  // Loading state
  if (loading.initial) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      </div>
    )
  }

  // Error state
  if (!promptData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Prompt not found
            </h3>
            <p className="text-neutral-600 mb-6">
              The prompt you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild variant="outline">
              <Link href={`/${workspaceSlug}`}>
                Back to workspace
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header - Clean and focused */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Edit Prompt</h1>
            <p className="text-sm text-neutral-600">
              {promptData.workspace.name}
            </p>
          </div>
          {hasChanges && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200">
              Unsaved changes
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={loading.saving || !hasChanges}
            className="gap-2"
          >
            {loading.saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Basic Info - Streamlined */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter prompt title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor - Simple or Advanced based on mode */}
      {isAdvancedMode ? (
        <div className="space-y-4">
          {/* Mode Toggle Bar for Advanced */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Advanced Mode</h3>
                  <p className="text-sm text-neutral-500">
                    Create complex prompts with specialized blocks and variables
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSimple}
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Simple Mode
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <AdvancedEditor
            blocks={formData.blocks}
            onChange={(blocks) => setFormData(prev => ({ ...prev, blocks }))}
            onBackToSimple={handleBackToSimple}
            title={formData.title}
          />
        </div>
      ) : (
        <SimpleEditor
          content={formData.content}
          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          onToggleAdvanced={toggleAdvancedMode}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          title={formData.title}
          isAdvancedMode={isAdvancedMode}
        />
      )}

      {/* Preview - Panel for simple mode, integrated in advanced mode */}
      {!isAdvancedMode && (
        <PreviewPanel 
          content={formData.content}
          title={formData.title}
          isVisible={showPreview}
        />
      )}

      {/* Advanced Settings - Collapsed by default */}
      <Card>
        <CardHeader className="pb-4">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </div>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        
        {showAdvanced && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublic">Public Access</Label>
                  <p className="text-sm text-neutral-500">
                    Allow anyone with the link to view this prompt
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isPublic: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isTemplate">Template</Label>
                  <p className="text-sm text-neutral-500">
                    Make this prompt available as a template for others
                  </p>
                </div>
                <Switch
                  id="isTemplate"
                  checked={formData.isTemplate}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isTemplate: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
} 