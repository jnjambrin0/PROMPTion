'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Copy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { Block } from '@/lib/types/shared'

interface Variable {
  name: string
  description?: string
}

interface UsePromptModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  blocks: Block[]
  title: string
}

function extractVariablesFromBlocks(blocks: Block[]): Variable[] {
  const variableRegex = /\{\{([^}]+)\}\}/g
  const variables = new Set<string>()
  
  blocks.forEach(block => {
    if (block.type === 'TEXT' || block.type === 'PROMPT') {
      const text = block.content?.text || ''
      let match
      while ((match = variableRegex.exec(text)) !== null) {
        const varName = match[1].trim()
        if (varName) {
          variables.add(varName)
        }
      }
    }
  })

  return Array.from(variables).map(name => ({
    name,
    description: `Variable: ${name}`
  }))
}

function generatePromptTextFromBlocks(blocks: Block[], values: Record<string, string>): string {
  let fullPrompt = ''

  blocks.forEach(block => {
    if (block.type === 'TEXT' || block.type === 'PROMPT') {
      let text = block.content?.text || ''
      Object.entries(values).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`, 'g')
        text = text.replace(regex, value || `{{${key}}}`)
      })
      fullPrompt += text + '\n\n'
    }
  })

  return fullPrompt.trim()
}

function renderContentWithStyledVariables(text: string, values: Record<string, string>): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  if (!text) return parts;

  const variableRegex = /\{\{([^}]+)\}\}/g;
  let lastIndex = 0;
  let match;

  while ((match = variableRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const varName = match[1].trim();
    const value = values[varName] || `{{${varName}}}`;
    parts.push(<strong key={`${varName}-${match.index}`} className="font-semibold text-foreground text-base">{value}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
}

export function UsePromptModal({ isOpen, onOpenChange, blocks, title }: UsePromptModalProps) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  
  const variables = useMemo(() => extractVariablesFromBlocks(blocks), [blocks])
  
  const generatedPromptText = useMemo(() => {
    return generatePromptTextFromBlocks(blocks, variableValues)
  }, [blocks, variableValues])
  
  const generatedPromptRender = useMemo(() => {
    const renderedBlocks = blocks.map((block) => {
      if (block.type === 'TEXT' || block.type === 'PROMPT') {
        const text = block.content?.text || ''
        return (
          <React.Fragment key={block.id}>
            {renderContentWithStyledVariables(text, variableValues)}
          </React.Fragment>
        )
      }
      return null
    }).filter(Boolean)

    return renderedBlocks.reduce((acc, current, index) => {
      if (index > 0) {
        acc.push(<br key={`br-${index}`} />,<br key={`br2-${index}`} />)
      }
      acc.push(current)
      return acc
    }, [] as React.ReactNode[])

  }, [blocks, variableValues])
  
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedPromptText)
      toast.success('Prompt copied to clipboard!')
      onOpenChange(false)
    } catch {
      toast.error('Failed to copy prompt.')
    }
  }, [generatedPromptText, onOpenChange])
  
  const allVariablesFilled = useMemo(() => {
    return variables.every(v => variableValues[v.name]?.trim())
  }, [variables, variableValues])

  // If no variables, just copy on open
  if (isOpen && variables.length === 0) {
    copyToClipboard()
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Use Prompt: {title}</DialogTitle>
          <DialogDescription>
            Fill in the variables to customize the prompt, then copy it to your clipboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          {/* Variable Inputs */}
          {variables.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Variables</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variables.map(variable => (
                  <div key={variable.name} className="space-y-1.5">
                    <Label htmlFor={`var-${variable.name}`}>{variable.name}</Label>
                    <Input
                      id={`var-${variable.name}`}
                      placeholder={`Enter value for ${variable.name}...`}
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => setVariableValues(prev => ({
                        ...prev,
                        [variable.name]: e.target.value
                      }))}
                    />
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          )}
          
          {/* Generated Prompt Preview */}
          <div className="space-y-3">
            <h4 className="font-medium">Generated Prompt</h4>
            <div className="relative p-4 bg-gray-50 border rounded-md min-h-[150px]">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                {generatedPromptRender}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 pt-4 border-t">
           <span className="text-sm text-gray-500">
            {variables.filter(v => variableValues[v.name]?.trim()).length} / {variables.length} variables filled
           </span>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={copyToClipboard} disabled={!allVariablesFilled}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Prompt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 