'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { getPromptPageDataAction, updatePromptAction } from '@/lib/actions/prompt'
import { SimpleEditor, PreviewPanel } from '@/components/prompt-editor'
import { AdvancedEditor } from '@/components/prompt-editor/advanced-editor'
import type { Block } from '@/lib/types/shared'
import type { JsonValue } from '@/lib/types/shared'

// Tipos directos basados en la estructura real de datos de la base de datos
interface PromptBlockData {
  id: string
  type: string
  content: JsonValue
  position: number
  indentLevel: number
  createdAt: Date
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
  initialPrompt?: Record<string, unknown>
  initialWorkspace?: Record<string, unknown>
}

interface LoadingState {
  initial: boolean
  saving: boolean
}

// Estructura real de los datos que vienen de getPromptPageDataAction
interface PromptPageData {
  id: string
  title: string
  description: string | null
  blocks: PromptBlockData[] // Usando la estructura real de DB
  isPublic: boolean
  isTemplate: boolean
  workspace: {
    name: string
  }
}

// Función auxiliar mínima para convertir blocks al formato esperado por AdvancedEditor
function convertBlocksForEditor(blocks: PromptBlockData[]): Block[] {
  return blocks.map(block => ({
    id: block.id,
    type: block.type as Block['type'],
    position: block.position,
    content: typeof block.content === 'object' && block.content !== null 
      ? block.content as Record<string, unknown>
      : { text: String(block.content) },
    createdAt: block.createdAt,
    indentLevel: block.indentLevel || 0
  }))
}

// Función auxiliar mínima para preparar blocks para el update action
function prepareBlocksForUpdate(blocks: Block[]) {
  return blocks.map(block => ({
    id: block.id,
    type: block.type,
    content: block.content,
    position: block.position
  }))
}

export function PromptEditClient({ 
  workspaceSlug, 
  promptSlug, 
  userId
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
  
  const [showPreview, setShowPreview] = useState(false)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [promptData, setPromptData] = useState<PromptPageData | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // Handlers for form data changes to track dirty state
  const handleFormDataChange = (newData: Partial<PromptEditData>) => {
    setFormData(prev => ({ ...prev, ...newData }))
    setIsDirty(true)
  }
  
  const handleBlocksChange = (newBlocks: Block[]) => {
    setFormData(prev => ({ ...prev, blocks: newBlocks }))
    setIsDirty(true)
  }

  // Convert blocks to simple content and vice versa
  const blocksToContent = useCallback((blocks: Block[]): string => {
    if (!Array.isArray(blocks)) return ''
    
    return blocks
      .filter(block => block.type === 'TEXT' || block.type === 'PROMPT')
      .map(block => {
        return block.content?.text || ''
      })
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
        // Usar datos directamente sin conversiones innecesarias
        const data = result.data as PromptPageData
        
        // Convert database blocks to editor format only when needed
        const editorBlocks = convertBlocksForEditor(data.blocks || [])
        
        // Convert blocks to simple content for editing
        const content = blocksToContent(editorBlocks)
        
        const initialFormData: PromptEditData = {
          title: data.title,
          description: data.description || '',
          content,
          blocks: [], // Will be populated when switching to advanced mode
          isPublic: data.isPublic,
          isTemplate: data.isTemplate
        }
        
        setFormData(initialFormData)
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
      const blocks = isAdvancedMode ? formData.blocks : contentToBlocks(formData.content)
      
      // Prepare blocks for the action
      const blockUpdates = prepareBlocksForUpdate(blocks)
      
      const result = await updatePromptAction(promptData.id, {
        title: formData.title,
        description: formData.description,
        blocks: blockUpdates,
        isPublic: formData.isPublic,
        isTemplate: formData.isTemplate
      })
      
      if (result.success) {
        setIsDirty(false)
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
  }, [formData, promptData, loading.saving, contentToBlocks, isAdvancedMode])

  // Handle navigation with unsaved changes
  const handleBack = useCallback(() => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push(`/${workspaceSlug}/${promptSlug}`)
      }
    } else {
      router.push(`/${workspaceSlug}/${promptSlug}`)
    }
  }, [isDirty, router, workspaceSlug, promptSlug])

  // Toggle advanced mode
  const toggleAdvancedMode = useCallback(() => {
    if (isDirty) {
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
  }, [isDirty, isAdvancedMode, formData.blocks, formData.content, blocksToContent, contentToBlocks])

  // Handle back to simple from advanced editor
  const handleBackToSimple = useCallback(() => {
    if (isDirty) {
      toast.error('Please save your changes before switching modes')
      return
    }
    
    const content = blocksToContent(formData.blocks)
    setFormData(prev => ({ ...prev, content, blocks: [] }))
    setIsAdvancedMode(false)
    toast.success('Switched to simple mode')
  }, [isDirty, formData.blocks, blocksToContent])

  // Load data on mount
  useEffect(() => {
    fetchPromptData()
  }, [fetchPromptData])

  // Browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

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
              The prompt you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
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
          {isDirty && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-200">
              Unsaved changes
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={loading.saving || !isDirty}
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

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
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
                initialBlocks={formData.blocks}
                onBlocksChange={handleBlocksChange}
                onSave={handleSave}
                onCancel={handleBackToSimple}
                isLoading={loading.saving}
                title={formData.title}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />
            </div>
          ) : (
            <SimpleEditor
              content={formData.content}
              onChange={(content) => handleFormDataChange({ content })}
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
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isPublic" className="font-medium">Public Access</Label>
                  <p className="text-sm text-neutral-500 mt-1">
                    Allow anyone with the link to view this prompt.
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => 
                    handleFormDataChange({ isPublic: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isTemplate" className="font-medium">Make it a Template</Label>
                  <p className="text-sm text-neutral-500 mt-1">
                    Make this prompt available as a template for others in the workspace.
                  </p>
                </div>
                <Switch
                  id="isTemplate"
                  checked={formData.isTemplate}
                  onCheckedChange={(checked) => 
                    handleFormDataChange({ isTemplate: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Basic Info - Streamlined */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFormDataChange({ title: e.target.value })}
                placeholder="Enter prompt title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleFormDataChange({ description: e.target.value })}
                placeholder="Brief description"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 