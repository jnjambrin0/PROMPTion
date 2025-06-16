import React, { useState, useCallback, useMemo } from 'react'
import { 
  Plus, GripVertical, Type, Hash, Code, Heading, Variable, Trash2,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Enhanced types for the advanced block system
interface Variable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  description: string
  required: boolean
  defaultValue?: string
  options?: string[] // For select type
}

interface Block {
  id: string
  type: 'TEXT' | 'VARIABLE' | 'PROMPT' | 'HEADING' | 'CODE'
  position: number
  content: {
    text?: string
    level?: number // For headings
    language?: string // For code blocks
    variable?: Variable // For variable blocks
  }
}

interface AdvancedEditorProps {
  initialBlocks?: Block[]
  onSave: (blocks: Block[]) => void
  onCancel: () => void
  isLoading?: boolean
  showPreview?: boolean
  onTogglePreview: () => void
}

// Hook for variable management
function useVariableDetection(blocks: Block[]) {
  return useMemo(() => {
    const variables = new Map<string, Variable>()
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
  onSelect, 
  position 
}: { 
  onSelect: (type: Block['type']) => void
  position: number 
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
  variables: Variable[]
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
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Enter text content... Use {{variable}} for dynamic content"
          className="min-h-[120px] resize-none border-none p-0 focus-visible:ring-0"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
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

  const updateVariable = (updates: Partial<Variable>) => {
    onChange({ variable: { ...variable, ...updates } })
  }

  return (
                  <Card className="group relative border-l-4 border-l-blue-600">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-neutral-400 cursor-grab" />
            <Badge variant="outline" className="text-xs">
              <Variable className="h-3 w-3 mr-1" />
              Variable Definition
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`var-name-${block.id}`} className="text-xs">Variable Name</Label>
            <Input
              id={`var-name-${block.id}`}
              value={variable.name}
              onChange={(e) => updateVariable({ name: e.target.value })}
              placeholder="variable_name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`var-type-${block.id}`} className="text-xs">Type</Label>
            <Select value={variable.type} onValueChange={(value) => updateVariable({ type: value as Variable['type'] })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="select">Select</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor={`var-desc-${block.id}`} className="text-xs">Description</Label>
          <Input
            id={`var-desc-${block.id}`}
            value={variable.description}
            onChange={(e) => updateVariable({ description: e.target.value })}
            placeholder="Describe this variable"
            className="mt-1"
          />
        </div>

        {variable.type === 'select' && (
          <div className="mt-4">
            <Label className="text-xs">Options (one per line)</Label>
            <Textarea
              value={variable.options?.join('\n') || ''}
              onChange={(e) => updateVariable({ options: e.target.value.split('\n').filter(Boolean) })}
              placeholder="option1&#10;option2&#10;option3"
              className="mt-1 min-h-[80px]"
            />
          </div>
        )}

        <div className="mt-4 flex items-center space-x-2">
          <Switch
            id={`var-required-${block.id}`}
            checked={variable.required}
            onCheckedChange={(checked) => updateVariable({ required: checked })}
          />
          <Label htmlFor={`var-required-${block.id}`} className="text-xs">Required</Label>
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
  variables: Variable[]
}) {
  return (
                  <Card className="group relative border-l-4 border-l-green-600">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-neutral-400 cursor-grab" />
            <Badge variant="outline" className="text-xs">
              <Hash className="h-3 w-3 mr-1" />
              Prompt Template
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        <Textarea
          value={block.content.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Enter your AI prompt template here... Use {{variables}} for dynamic content"
          className="min-h-[140px] resize-none border-none p-0 focus-visible:ring-0"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
        />
        
        {variables.length > 0 && (
                        <div className="mt-3 p-3 rounded border bg-green-50">
                <p className="text-xs font-medium mb-2 text-green-800">Available Variables:</p>
            <div className="flex flex-wrap gap-1">
              {variables.map(variable => (
                                  <Badge key={variable.name} variant="outline" className="text-xs text-green-600">
                  {'{{'}{variable.name}{'}}'}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AdvancedEditor({
  initialBlocks = [],
  onSave,
  onCancel,
  isLoading = false,
  showPreview = false,
  onTogglePreview,
}: AdvancedEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showBlockSelector, setShowBlockSelector] = useState<number | null>(null)
  const [testValues, setTestValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const variables = useVariableDetection(blocks)

  const addBlock = useCallback((type: Block['type'], position: number) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      position,
      content: type === 'VARIABLE' ? {
        variable: {
          name: '',
          type: 'string',
          description: '',
          required: true
        }
      } : {}
    }
    
    const newBlocks = [...blocks]
    newBlocks.splice(position, 0, newBlock)
    
    // Reindex positions
    newBlocks.forEach((block, index) => {
      block.position = index
    })
    
    setBlocks(newBlocks)
    setShowBlockSelector(null)
  }, [blocks, setBlocks])

  const updateBlock = useCallback((id: string, content: Block['content']) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }, [blocks, setBlocks])

  const removeBlock = useCallback((id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id)
    // Reindex positions
    newBlocks.forEach((block, index) => {
      block.position = index
    })
    setBlocks(newBlocks)
  }, [blocks, setBlocks])

  // Preview functions
  const generatePreview = useCallback(() => {
    return blocks
      .filter(block => block.type === 'TEXT' || block.type === 'PROMPT')
      .map(block => {
        let text = block.content.text || ''
        
        // Replace variables with test values
        variables.forEach(variable => {
          const value = testValues[variable.name] || `[${variable.name}]`
          const regex = new RegExp(`\\{\\{${variable.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`, 'g')
          text = text.replace(regex, value)
        })
        
        return text
      })
      .join('\n\n')
  }, [blocks, variables, testValues])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatePreview())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [generatePreview])

  const fillSampleValues = useCallback(() => {
    const sampleValues: Record<string, string> = {}
    variables.forEach(variable => {
      const name = variable.name.toLowerCase()
      if (name.includes('name')) {
        sampleValues[variable.name] = 'Alex'
      } else if (name.includes('topic') || name.includes('subject')) {
        sampleValues[variable.name] = 'artificial intelligence'
      } else if (name.includes('tone') || name.includes('style')) {
        sampleValues[variable.name] = 'professional'
      } else if (name.includes('task') || name.includes('job')) {
        sampleValues[variable.name] = 'writing a blog post'
      } else if (name.includes('requirement')) {
        sampleValues[variable.name] = 'detailed examples and clear explanations'
      } else {
        sampleValues[variable.name] = `sample ${variable.name}`
      }
    })
    setTestValues(sampleValues)
  }, [variables])

  const resetTestValues = useCallback(() => {
    setTestValues({})
  }, [])

  const renderBlock = (block: Block) => {
    const props = {
      block,
      onChange: (content: Block['content']) => updateBlock(block.id, content),
      onRemove: () => removeBlock(block.id),
      variables
    }

    switch (block.type) {
      case 'TEXT':
        return <TextBlock key={block.id} {...props} />
      case 'VARIABLE':
        return <VariableBlock key={block.id} {...props} />
      case 'PROMPT':
        return <PromptBlock key={block.id} {...props} />
      default:
        return <TextBlock key={block.id} {...props} />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Editor
            </CardTitle>
            <CardDescription>
              Create complex prompts with specialized blocks and variables
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowBlockSelector(blocks.length)} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Block
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {blocks.length === 0 ? (
          <div className="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-neutral-400" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-1">Start building your advanced prompt</h4>
                <p className="text-sm text-neutral-500 mb-4">Add blocks to create your AI prompt template</p>
                <Button onClick={() => setShowBlockSelector(0)} variant="outline">
                  Add your first block
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={block.id}>
                {renderBlock(block)}
                
                {/* Add block button between blocks */}
                <div className="flex justify-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => setShowBlockSelector(index + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Block type selector */}
        {showBlockSelector !== null && (
          <div className="space-y-4">
            <BlockTypeSelector
              onSelect={(type) => addBlock(type, showBlockSelector)}
              position={showBlockSelector}
            />
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBlockSelector(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Integrated Preview Section */}
        <div className="pt-6">
          <Separator className="mb-6" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <h3 className="font-medium">Live Preview</h3>
                <Badge variant="outline" className="text-xs">
                  {variables.length} variables
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTogglePreview}
                  className="gap-2"
                >
                  <Eye className="h-3 w-3" />
                  {showPreview ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            {showPreview && (
              <div className="space-y-4">
                {/* Variable Testing Panel */}
                {variables.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Test Variables</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fillSampleValues}
                          className="gap-2 text-xs h-7"
                        >
                          <Play className="h-3 w-3" />
                          Fill Sample
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetTestValues}
                          className="gap-2 text-xs h-7"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-lg border">
                      {variables.map(variable => (
                        <div key={variable.name} className="space-y-1">
                          <Label htmlFor={`adv-test-${variable.name}`} className="text-xs font-medium flex items-center gap-1">
                            {variable.name}
                            {variable.required && <span className="text-red-500 text-xs">*</span>}
                          </Label>
                          <Input
                            id={`adv-test-${variable.name}`}
                            placeholder={variable.description || `Enter ${variable.name}...`}
                            value={testValues[variable.name] || ''}
                            onChange={(e) => setTestValues(prev => ({ 
                              ...prev, 
                              [variable.name]: e.target.value 
                            }))}
                            className="text-xs h-7"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Generated Prompt</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">
                        {generatePreview().length} characters
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="gap-2 h-7"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white border rounded-lg min-h-[120px] max-h-[300px] overflow-y-auto">
                    {generatePreview().trim() ? (
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-neutral-800">
                        {generatePreview()}
                      </pre>
                    ) : (
                      <div className="text-neutral-400 text-sm italic flex items-center justify-center h-20">
                        Add content blocks to see preview...
                      </div>
                    )}
                  </div>

                  {/* Variable Status */}
                  {variables.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-neutral-500 p-2 bg-neutral-50 rounded">
                      <div className="flex items-center gap-3">
                        <span>Variables: {variables.length}</span>
                        <span className="text-green-600">
                          Filled: {variables.filter(v => testValues[v.name]?.trim()).length}
                        </span>
                        <span className="text-red-600">
                          Missing: {variables.filter(v => !testValues[v.name]?.trim()).length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 