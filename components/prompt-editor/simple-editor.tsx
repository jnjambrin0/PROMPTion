import { useState, useCallback, useMemo } from 'react'
import { Variable, Eye, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PreviewPopup } from './preview-popup'

interface Variable {
  name: string
  description?: string
}

interface SimpleEditorProps {
  content: string
  onChange: (content: string) => void
  onToggleAdvanced: () => void
  showPreview: boolean
  onTogglePreview: () => void
  title?: string
  isAdvancedMode?: boolean
}

// Hook to extract variables from text
function useVariableExtraction(text: string): Variable[] {
  return useMemo(() => {
    const variableRegex = /\{\{([^}]+)\}\}/g
    const variables = new Set<string>()
    let match

    while ((match = variableRegex.exec(text)) !== null) {
      const varName = match[1].trim()
      if (varName) {
        variables.add(varName)
      }
    }

    return Array.from(variables).map(name => ({
      name,
      description: `Variable: ${name}`
    }))
  }, [text])
}

// Simple variable insertion helper
function VariableHelper({ 
  variables, 
  onInsert 
}: { 
  variables: Variable[]
  onInsert: (varName: string) => void 
}) {
  if (variables.length === 0) {
    return (
      <div className="text-sm text-neutral-500 p-3 bg-neutral-50 rounded border">
        💡 <strong>Tip:</strong> Use <code>{'{{'}</code>variable<code>{'}}'}</code> syntax to create dynamic content
      </div>
    )
  }

  return (
    <div className="p-3 bg-neutral-50 rounded border">
      <p className="text-sm font-medium text-neutral-700 mb-2">
        Variables found in your prompt:
      </p>
      <div className="flex flex-wrap gap-1">
        {variables.map(variable => (
          <Badge 
            key={variable.name} 
            variant="outline" 
            className="cursor-pointer hover:bg-neutral-100 text-xs"
            onClick={() => onInsert(variable.name)}
          >
            <Variable className="h-3 w-3 mr-1" />
            {variable.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function SimpleEditor({ 
  content, 
  onChange, 
  onToggleAdvanced,
  showPreview,
  onTogglePreview,
  title,
  isAdvancedMode = false
}: SimpleEditorProps) {
  const variables = useVariableExtraction(content)

  const insertVariable = useCallback((varName: string) => {
    const textarea = document.getElementById('simple-editor') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + `{{${varName}}}` + content.substring(end)
      onChange(newContent)
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + varName.length + 4
        textarea.focus()
      }, 0)
    }
  }, [content, onChange])

  return (
    <div className="space-y-4">
      {/* Main Editor */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Prompt Content</CardTitle>
              <CardDescription>
                Write your prompt and use variables for dynamic content
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <PreviewPopup 
                content={content}
                title={title}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                }
              />
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleAdvanced}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                {isAdvancedMode ? 'Simple Mode' : 'Advanced'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="simple-editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your prompt here...

Example:
Hello {{name}}, please help me with {{task}}. 

I want you to be {{tone}} and focus on {{topic}}.

Make sure to include {{requirements}} in your response."
            className="min-h-[300px] resize-none font-mono text-sm leading-relaxed"
          />
          
          <VariableHelper 
            variables={variables} 
            onInsert={insertVariable} 
          />
        </CardContent>
      </Card>
    </div>
  )
} 