import { useMemo } from 'react'
import Link from 'next/link'
import { FileText, FolderOpen, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { searchHelpers } from '@/lib/constants/help-data'
import type { HelpSearchResult } from '@/lib/types/help'

interface HelpSearchResultItemProps {
  result: HelpSearchResult
  query: string
  isSelected: boolean
  onClick: () => void
}

export function HelpSearchResultItem({ 
  result, 
  query, 
  isSelected, 
  onClick 
}: HelpSearchResultItemProps) {
  const Icon = result.type === 'article' ? FileText : FolderOpen

  // Highlight search terms in title and description
  const highlightedTitle = useMemo(() => {
    return searchHelpers.highlightSearchTerms(result.title, query)
  }, [result.title, query])

  const highlightedDescription = useMemo(() => {
    return searchHelpers.highlightSearchTerms(result.description, query)
  }, [result.description, query])

  return (
    <Link
      href={result.href}
      onClick={onClick}
      className={cn(
        'block w-full text-left transition-all duration-150',
        'hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
        'border-l-2 border-transparent hover:border-gray-200',
        isSelected && 'bg-blue-50 border-l-blue-400 hover:bg-blue-50'
      )}
    >
      <div className="px-3 py-2.5">
        {/* Compact header with icon and title */}
        <div className="flex items-start space-x-2.5">
          <Icon className={cn(
            'h-4 w-4 mt-0.5 flex-shrink-0',
            result.type === 'article' ? 'text-blue-600' : 'text-amber-600'
          )} />
          
          <div className="flex-1 min-w-0">
            {/* Title - more compact */}
            <h4 
              className="text-sm font-medium text-gray-900 leading-snug mb-1"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
            />
            
            {/* Description - single line with ellipsis */}
            <p 
              className="text-xs text-gray-600 leading-relaxed line-clamp-1 mb-1.5"
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
            
            {/* Compact metadata row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {result.type === 'article' && result.categoryTitle && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5 text-gray-600 border-gray-300">
                    {result.categoryTitle}
                  </Badge>
                )}
                
                {result.relevanceScore && result.relevanceScore > 80 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5 bg-green-50 text-green-700 border-green-200">
                    Best Match
                  </Badge>
                )}
              </div>
              
              {/* Subtle arrow indicator */}
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 