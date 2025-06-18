import { useMemo } from 'react'
import { FileText, FolderOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { HelpSearchResult } from '@/lib/types/help'
import { HelpSearchResultItem } from './help-search-result-item'

interface HelpSearchResultsProps {
  results: HelpSearchResult[]
  query: string
  isSearching: boolean
  selectedIndex: number
  onResultSelect: (index: number) => void
}

interface GroupedResults {
  articles: HelpSearchResult[]
  categories: HelpSearchResult[]
}

export function HelpSearchResults({ 
  results, 
  query, 
  isSearching, 
  selectedIndex,
  onResultSelect 
}: HelpSearchResultsProps) {
  const groupedResults = useMemo((): GroupedResults => {
    return results.reduce((acc, result) => {
      if (result.type === 'article') {
        acc.articles.push(result)
      } else {
        acc.categories.push(result)
      }
      return acc
    }, { articles: [], categories: [] } as GroupedResults)
  }, [results])

  const totalResults = results.length

  if (isSearching) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          <p className="text-sm text-gray-600">Searching...</p>
        </div>
      </Card>
    )
  }

  if (!query.trim()) {
    return null
  }

  if (totalResults === 0) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6">
        <div className="text-center space-y-2">
          <FileText className="h-8 w-8 text-gray-400 mx-auto" />
          <h3 className="text-sm font-medium text-gray-900">
            No results found
          </h3>
          <p className="text-xs text-gray-500">
            Try different keywords or browse the categories below
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
      {/* Compact results container with better space usage */}
      <div className="max-h-96 overflow-y-auto">
        {/* Categories Section */}
        {groupedResults.categories.length > 0 && (
          <div className="border-b border-gray-100 last:border-b-0">
            {/* Inline section header - more compact */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50/80 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-gray-700">Categories</span>
              </div>
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-white">
                {groupedResults.categories.length}
              </Badge>
            </div>
            
            <div className="py-1">
              {groupedResults.categories.map((result) => {
                const globalIndex = results.findIndex(r => r === result)
                return (
                  <HelpSearchResultItem
                    key={`${result.type}-${result.slug}`}
                    result={result}
                    query={query}
                    isSelected={globalIndex === selectedIndex}
                    onClick={() => onResultSelect(globalIndex)}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Articles Section */}
        {groupedResults.articles.length > 0 && (
          <div className="border-b border-gray-100 last:border-b-0">
            {/* Inline section header - more compact */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50/80 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Articles</span>
              </div>
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-white">
                {groupedResults.articles.length}
              </Badge>
            </div>
            
            <div className="py-1">
              {groupedResults.articles.map((result) => {
                const globalIndex = results.findIndex(r => r === result)
                return (
                  <HelpSearchResultItem
                    key={`${result.type}-${result.slug}`}
                    result={result}
                    query={query}
                    isSelected={globalIndex === selectedIndex}
                    onClick={() => onResultSelect(globalIndex)}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Minimal footer with keyboard hints */}
      <div className="border-t border-gray-100 px-3 py-2 bg-gray-50/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span className="text-gray-400">{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </Card>
  )
} 