import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { 
  Plus, GripVertical, Type, Hash, Code, Heading, Variable, Trash2,
  Eye, RotateCcw, Check, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Block, BlockVariable } from '@/lib/types/shared'

// Props interface for the AdvancedEditor component
interface AdvancedEditorProps {
  initialBlocks?: Block[]
  onBlocksChange: (blocks: Block[]) => void
  onSave: () => void
  onCancel: () => void
  isLoading?: boolean
  showPreview?: boolean
  onTogglePreview: () => void
  title?: string
}

// Hook for variable management
function useVariableDetection(blocks: Block[]) {
  return useMemo(() => {
    const variables = new Map<string, BlockVariable>()
    const variableRegex = /\{\{([^}]+)\}\}/g
    
    // Extract variables from text blocks
    blocks.forEach(block => {
      if (block.type === 'TEXT' || block.type === 'PROMPT') {
        const text = block.content.text || ''
        let match
        while ((match = variableRegex.exec(text)) !== null) {
          const varName = match[1].trim()
          if (!variables.has(varName)) {
            variables.set(varName, {
              name: varName,
              type: 'string',
              description: `Variable: ${varName}`,
              required: true
            })
          }
        }
      }
    })

    // Add explicitly defined variables
    blocks.forEach(block => {
      if (block.type === 'VARIABLE' && block.content.variable) {
        variables.set(block.content.variable.name, block.content.variable)
      }
    })

    return Array.from(variables.values())
  }, [blocks])
}

// Block type selector component
function BlockTypeSelector({ 
  onSelect
}: { 
  onSelect: (type: Block['type']) => void
}) {
  const blockTypes = [
    { type: 'TEXT' as const, icon: Type, label: 'Text', description: 'Rich text content' },
    { type: 'PROMPT' as const, icon: Hash, label: 'Prompt', description: 'AI prompt template' },
    { type: 'VARIABLE' as const, icon: Variable, label: 'Variable', description: 'Define a variable' },
    { type: 'HEADING' as const, icon: Heading, label: 'Heading', description: 'Section title' },
    { type: 'CODE' as const, icon: Code, label: 'Code', description: 'Code snippet' },
  ]

  return (
    <Card className="border-dashed border-2 border-neutral-200 bg-neutral-50/50">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <p className="text-sm text-neutral-600">Choose a block type to add</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {blockTypes.map(({ type, icon: Icon, label, description }) => (
            <Button
              key={type}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-white hover:shadow-sm"
              onClick={() => onSelect(type)}
            >
              <Icon className="h-5 w-5 text-neutral-600" />
              <div className="text-center">
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[10px] text-neutral-500 hidden md:block">{description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Individual block components
function TextBlock({ 
  block, 
  onChange, 
  onRemove,
  variables
}: { 
  block: Block
  onChange: (content: Block['content']) => void
  onRemove: () => void
  variables: BlockVariable[]
}) {
  const [showVariableHelper, setShowVariableHelper] = useState(false)
  
  const insertVariable = (varName: string) => {
    const textarea = document.getElementById(`block-${block.id}`) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = block.content.text || ''
      const newText = text.substring(0, start) + `{{${varName}}}` + text.substring(end)
      onChange({ text: newText })
      
      // Set cursor position after variable
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + varName.length + 4
        textarea.focus()
      }, 0)
    }
    setShowVariableHelper(false)
  }

  return (
    <Card className="group relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-neutral-400 cursor-grab" />
            <Badge variant="outline" className="text-xs">
              <Type className="h-3 w-3 mr-1" />
              Text
            </Badge>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowVariableHelper(!showVariableHelper)}
              title="Insert variable"
            >
              <Variable className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              onClick={onRemove}
              title="Remove block"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {showVariableHelper && variables.length > 0 && (
          <div className="mb-3 p-2 bg-neutral-50 rounded border">
            <p className="text-xs text-neutral-600 mb-2">Insert variable:</p>
            <div className="flex flex-wrap gap-1">
              {variables.map(variable => (
                <Button
                  key={variable.name}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => insertVariable(variable.name)}
                >
                  {variable.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <Textarea
          id={`block-${block.id}`}
          value={block.content.text || ''}
          onChange={(e) => onChange({ ...block.content, text: e.target.value })}
          placeholder="Enter your text content..."
          className="min-h-[100px] resize-none border-0 p-0 shadow-none focus:ring-0"
        />
      </CardContent>
    </Card>
  )
}

function VariableBlock({ 
  block, 
  onChange, 
  onRemove 
}: { 
  block: Block
  onChange: (content: Block['content']) => void
  onRemove: () => void
}) {
  const variable = block.content.variable || {
    name: '',
    type: 'string' as const,
    description: '',
    required: true
  }
  
  const updateVariable = (updates: Partial<BlockVariable>) => {
    const updatedVariable = { ...variable, ...updates }
    onChange({ ...block.content, variable: updatedVariable })
  }

  return (
    <Card className="group relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-neutral-400 cursor-grab" />
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              <Variable className="h-3 w-3 mr-1" />
              Variable
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
            title="Remove block"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`var-name-${block.id}`} className="text-xs">Variable Name</Label>
              <Input
                id={`var-name-${block.id}`}
                value={variable.name}
                onChange={(e) => updateVariable({ name: e.target.value })}
                placeholder="variableName"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`var-type-${block.id}`} className="text-xs">Type</Label>
              <Select value={variable.type} onValueChange={(value: BlockVariable['type']) => updateVariable({ type: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="select">Select Options</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor={`var-desc-${block.id}`} className="text-xs">Description</Label>
            <Input
              id={`var-desc-${block.id}`}
              value={variable.description}
              onChange={(e) => updateVariable({ description: e.target.value })}
              placeholder="Describe what this variable is for..."
              className="mt-1"
            />
          </div>

          {variable.type === 'select' && (
            <div>
              <Label htmlFor={`var-options-${block.id}`} className="text-xs">Options (comma-separated)</Label>
              <Input
                id={`var-options-${block.id}`}
                value={variable.options?.join(', ') || ''}
                onChange={(e) => updateVariable({ options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="option1, option2, option3"
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id={`var-required-${block.id}`}
              checked={variable.required}
              onCheckedChange={(checked) => updateVariable({ required: checked })}
            />
            <Label htmlFor={`var-required-${block.id}`} className="text-xs">Required</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PromptBlock({ 
  block, 
  onChange, 
  onRemove,
  variables
}: { 
  block: Block
  onChange: (content: Block['content']) => void
  onRemove: () => void
  variables: BlockVariable[]
}) {
  const [showVariableHelper, setShowVariableHelper] = useState(false)
  
  const insertVariable = (varName: string) => {
    const textarea = document.getElementById(`prompt-block-${block.id}`) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = block.content.text || ''
      const newText = text.substring(0, start) + `{{${varName}}}` + text.substring(end)
      onChange({ text: newText })
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + varName.length + 4
        textarea.focus()
      }, 0)
    }
    setShowVariableHelper(false)
  }

  return (
    <Card className="group relative border-orange-200 bg-orange-50/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-neutral-400 cursor-grab" />
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              <Hash className="h-3 w-3 mr-1" />
              Prompt
            </Badge>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowVariableHelper(!showVariableHelper)}
              title="Insert variable"
            >
              <Variable className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              onClick={onRemove}
              title="Remove block"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {showVariableHelper && variables.length > 0 && (
          <div className="mb-3 p-2 bg-neutral-50 rounded border">
            <p className="text-xs text-neutral-600 mb-2">Insert variable:</p>
            <div className="flex flex-wrap gap-1">
              {variables.map(variable => (
                <Button
                  key={variable.name}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => insertVariable(variable.name)}
                >
                  {variable.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <Textarea
          id={`prompt-block-${block.id}`}
          value={block.content.text || ''}
          onChange={(e) => onChange({ ...block.content, text: e.target.value })}
          placeholder="Enter your prompt template..."
          className="min-h-[120px] resize-none border-0 p-0 shadow-none focus:ring-0 bg-transparent"
        />
      </CardContent>
    </Card>
  )
}

export function AdvancedEditor({
  initialBlocks = [],
  onBlocksChange,
  onSave,
  onCancel,
  isLoading = false,
  showPreview = false,
  onTogglePreview,
}: AdvancedEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [showingBlockSelector, setShowingBlockSelector] = useState(false)
  
  useEffect(() => {
    onBlocksChange(blocks)
  }, [blocks, onBlocksChange])
  
  // Auto-detect variables from blocks
  const detectedVariables = useVariableDetection(blocks)
  
  // Add new block
  const addBlock = useCallback((type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      position: blocks.length,
      content: type === 'VARIABLE' ? {
        variable: {
          name: '',
          type: 'string',
          description: '',
          required: true
        }
      } : type === 'HEADING' ? {
        text: '',
        level: 1
      } : type === 'CODE' ? {
        text: '',
        language: 'javascript'
      } : {
        text: ''
      }
    }
    
    setBlocks(prev => [...prev, newBlock])
    setShowingBlockSelector(false)
  }, [blocks.length])
  
  // Remove block
  const removeBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId))
  }, [])
  
  // Update block content
  const updateBlock = useCallback((blockId: string, content: Block['content']) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, content } : block
    ))
  }, [])
  
  // Save blocks
  const handleSave = useCallback(() => {
    onSave()
  }, [onSave])

  const renderBlock = (block: Block) => {
    const props = {
      block,
      onChange: (content: Block['content']) => updateBlock(block.id, content),
      onRemove: () => removeBlock(block.id),
      variables: detectedVariables
    }

    switch (block.type) {
      case 'TEXT':
        return <TextBlock key={block.id} {...props} />
      case 'VARIABLE':
        return <VariableBlock key={block.id} {...props} />
      case 'PROMPT':
        return <PromptBlock key={block.id} {...props} />
      default:
        // Render other block types here if any
        return <TextBlock key={block.id} {...props} />
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Advanced Editor</CardTitle>
              <CardDescription>
                Build complex prompts with variables and structured blocks
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePreview}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Variables summary */}
      {detectedVariables.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Variable className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Variables ({detectedVariables.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {detectedVariables.map(variable => (
                <Badge key={variable.name} variant="outline" className="text-xs">
                  {variable.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.map(renderBlock)}
        
        {/* Add block section */}
        {showingBlockSelector ? (
          <BlockTypeSelector onSelect={addBlock} />
        ) : (
          <Card className="border-dashed border-2 border-neutral-200 bg-neutral-50/50">
            <CardContent className="p-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowingBlockSelector(true)}
                className="gap-2 text-neutral-600 hover:text-neutral-900"
              >
                <Plus className="h-4 w-4" />
                Add Block
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 