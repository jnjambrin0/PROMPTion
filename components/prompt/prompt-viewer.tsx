import { Code, Type, List, Hash, Quote, FileText, ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BlockContent {
  text?: string
  level?: number
  language?: string
  items?: string[]
  ordered?: boolean
}

interface PromptBlock {
  id: string
  type: string
  content: BlockContent | string
  position: number
  indentLevel: number
}

interface PromptVariable {
  name: string
  type: string
  description?: string
  defaultValue?: string
}

interface ModelConfig {
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  [key: string]: unknown
}

interface PromptViewerProps {
  prompt: {
    id: string
    title: string
    description?: string | null
    blocks?: PromptBlock[]
    variables?: PromptVariable[]
    modelConfig?: ModelConfig
  }
}

function getBlockIcon(type: string) {
  switch (type) {
    case 'text':
      return <Type className="h-4 w-4 text-gray-600" />
    case 'code':
      return <Code className="h-4 w-4 text-blue-600" />
    case 'image':
      return <ImageIcon className="h-4 w-4 text-green-600"/>
    case 'list':
      return <List className="h-4 w-4 text-purple-600" />
    case 'heading':
      return <Hash className="h-4 w-4 text-orange-600" />
    case 'quote':
      return <Quote className="h-4 w-4 text-gray-600" />
    default:
      return <FileText className="h-4 w-4 text-gray-600" />
  }
}

function renderBlockContent(block: PromptBlock) {
  const content = typeof block.content === 'string' ? block.content : block.content?.text || ''
  
  switch (block.type) {
    case 'heading':
      const level = (typeof block.content === 'object' && block.content?.level) || 1
      const className = `font-semibold ${
        level === 1 ? 'text-xl' : 
        level === 2 ? 'text-lg' : 
        level === 3 ? 'text-base' : 'text-sm'
      } text-gray-900 mb-2`
      
      if (level === 1) return <h1 className={className}>{content}</h1>
      if (level === 2) return <h2 className={className}>{content}</h2>
      if (level === 3) return <h3 className={className}>{content}</h3>
      if (level === 4) return <h4 className={className}>{content}</h4>
      if (level === 5) return <h5 className={className}>{content}</h5>
      return <h6 className={className}>{content}</h6>
      
    case 'code':
      return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <pre className="text-sm text-gray-800 overflow-x-auto">
            <code>{content}</code>
          </pre>
          {typeof block.content === 'object' && block.content?.language && (
            <Badge variant="outline" className="mt-2 text-xs">
              {block.content.language}
            </Badge>
          )}
        </div>
      )
      
    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 py-2 italic text-gray-700 bg-gray-50 rounded-r-lg">
          {content}
        </blockquote>
      )
      
    case 'list':
      const blockContent = typeof block.content === 'object' ? block.content : {}
      const items = Array.isArray(blockContent?.items) ? blockContent.items : [content]
      const isOrdered = blockContent?.ordered === true
      const ListTag = isOrdered ? 'ol' : 'ul'
      
      return (
        <ListTag className={`${isOrdered ? 'list-decimal' : 'list-disc'} list-inside space-y-1 text-gray-700`}>
          {items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      )
      
    case 'variable':
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
          <span>{'{'}</span>
          <span>{content}</span>
          <span>{'}'}</span>
        </div>
      )
      
    default:
      return (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      )
  }
}

export function PromptViewer({ prompt }: PromptViewerProps) {
  const blocks = prompt.blocks || []

  if (blocks.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No content yet
        </h3>
        <p className="text-gray-600">
          This prompt doesn&apos;t have any content blocks yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Variables Preview */}
      {prompt.variables && prompt.variables.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Variables in this prompt
            </h4>
            <div className="flex flex-wrap gap-2">
              {prompt.variables.map((variable, index) => (
                <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  {variable.name}
                  {variable.type !== 'string' && (
                    <span className="ml-1 text-xs opacity-75">({variable.type})</span>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks
          .sort((a, b) => a.position - b.position)
          .map((block, index) => {
            const indentClass = block.indentLevel > 0 ? `ml-${Math.min(block.indentLevel * 4, 16)}` : ''
            
            return (
              <div key={block.id} className={`group ${indentClass}`}>
                <div className="flex items-start gap-3">
                  {/* Block Type Icon */}
                  <div className="flex-shrink-0 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {getBlockIcon(block.type)}
                  </div>
                  
                  {/* Block Content */}
                  <div className="flex-1 min-w-0">
                    {renderBlockContent(block)}
                  </div>
                  
                  {/* Block Position Indicator */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity">
                    <span className="text-xs text-gray-500">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Prompt Stats */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
          </span>
          <span>
            {prompt.variables?.length || 0} {prompt.variables?.length === 1 ? 'variable' : 'variables'}
          </span>
        </div>
      </div>
    </div>
  )
} 