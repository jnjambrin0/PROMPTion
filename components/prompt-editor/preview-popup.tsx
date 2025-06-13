import { useState, useMemo } from 'react'
import { Eye, Copy, Check, Play, RotateCcw, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Variable {
  name: string
  description?: string
}

interface PreviewPopupProps {
  content: string
  title?: string
  trigger?: React.ReactNode
}

// Extract variables from content
function extractVariables(content: string): Variable[] {
  const variableRegex = /\{\{([^}]+)\}\}/g
  const variables = new Set<string>()
  let match

  while ((match = variableRegex.exec(content)) !== null) {
    const varName = match[1].trim()
    if (varName) {
      variables.add(varName)
    }
  }

  return Array.from(variables).map(name => ({
    name,
    description: `Variable: ${name}`
  }))
}

export function PreviewPopup({ content, title, trigger }: PreviewPopupProps) {
  const [testValues, setTestValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  
  const variables = useMemo(() => extractVariables(content), [content])

  // Generate preview with variable substitution
  const preview = useMemo(() => {
    let result = content
    
    variables.forEach(variable => {
      const value = testValues[variable.name] || `[${variable.name}]`
      const regex = new RegExp(`\\{\\{${variable.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`, 'g')
      result = result.replace(regex, value)
    })
    
    return result
  }, [content, variables, testValues])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(preview)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const resetTestValues = () => {
    setTestValues({})
  }

  const fillSampleValues = () => {
    const sampleValues: Record<string, string> = {}
    variables.forEach(variable => {
      // Generate sample values based on common variable names
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
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Eye className="h-4 w-4" />
      Preview
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5" />
            Prompt Preview
            {title && <span className="text-sm font-normal text-neutral-500">- {title}</span>}
          </DialogTitle>
          <DialogDescription>
            Test your prompt with different variable values and copy the final result
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {/* Variable Testing Panel */}
          {variables.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Test Variables</h4>
                  <Badge variant="outline" className="text-xs">
                    {variables.length} found
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fillSampleValues}
                    className="gap-2 text-xs h-8"
                  >
                    <Play className="h-3 w-3" />
                    Fill Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetTestValues}
                    className="gap-2 text-xs h-8"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-lg border">
                {variables.map(variable => (
                  <div key={variable.name} className="space-y-1">
                    <Label htmlFor={`popup-test-${variable.name}`} className="text-xs font-medium">
                      {variable.name}
                    </Label>
                    <Input
                      id={`popup-test-${variable.name}`}
                      placeholder={`Enter ${variable.name}...`}
                      value={testValues[variable.name] || ''}
                      onChange={(e) => setTestValues(prev => ({ 
                        ...prev, 
                        [variable.name]: e.target.value 
                      }))}
                      className="text-sm h-8"
                    />
                  </div>
                ))}
              </div>
              
              <Separator />
            </div>
          )}
          
          {/* Preview Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Generated Prompt</h4>
              <div className="flex items-center gap-2">
                <div className="text-xs text-neutral-500">
                  {preview.length} characters
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2 h-8"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="p-4 bg-white border rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto">
                {preview.trim() ? (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-neutral-800">
                    {preview}
                  </pre>
                ) : (
                  <div className="text-neutral-400 text-sm italic flex items-center justify-center h-32">
                    Your prompt will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Variable Status */}
          {variables.length > 0 && (
            <div className="flex items-center justify-between text-xs text-neutral-500 p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span>Variables: {variables.length}</span>
                                        <span className="text-green-600">
                          Filled: {variables.filter(v => testValues[v.name]?.trim()).length}
                        </span>
                        <span className="text-red-600">
                          Missing: {variables.filter(v => !testValues[v.name]?.trim()).length}
                        </span>
              </div>
              <div className="text-neutral-400">
                Click variables to auto-fill
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 