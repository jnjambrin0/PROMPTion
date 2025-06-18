'use client'

import { useState, useCallback, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Command } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { searchHelpers } from '@/lib/constants/help-data'
import { HelpSearchResults } from './help-search-results'
import type { HelpSearchState } from '@/lib/types/help'

interface HelpSearchProps {
  placeholder?: string
  className?: string
  autoFocus?: boolean
  showShortcut?: boolean
}

export function HelpSearch({ 
  placeholder = 'Search for help articles...', 
  className = '',
  autoFocus = false,
  showShortcut = true
}: HelpSearchProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search state management
  const [searchState, setSearchState] = useState<HelpSearchState>({
    query: '',
    results: [],
    isSearching: false,
    hasSearched: false,
    filters: { type: 'all' },
    selectedIndex: -1
  })

  // Debounced search query to prevent excessive processing
  const debouncedQuery = useDebounce(searchState.query, 300)

  // Memoized search execution
  const executeSearch = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchState(prevState => ({
        ...prevState,
        results: [],
        isSearching: false,
        hasSearched: false,
        selectedIndex: -1
      }))
      return
    }

    setSearchState(prevState => ({ ...prevState, isSearching: true }))
    
    startTransition(() => {
      try {
        // Perform search with current filters - using 'all' as default since we need to access current state
        const results = searchHelpers.searchArticles(query, {
          type: 'all' // Default to searching all types
        })

        setSearchState(prevState => ({
          ...prevState,
          results,
          isSearching: false,
          hasSearched: true,
          selectedIndex: results.length > 0 ? 0 : -1
        }))
      } catch (error) {
        console.error('Search error:', error)
        setSearchState(prevState => ({
          ...prevState,
          results: [],
          isSearching: false,
          hasSearched: true,
          selectedIndex: -1
        }))
      }
    })
  }, [])

  // Execute search when debounced query changes
  useEffect(() => {
    executeSearch(debouncedQuery)
  }, [debouncedQuery, executeSearch])

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!searchState.results.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSearchState(prev => ({
          ...prev,
          selectedIndex: Math.min(prev.selectedIndex + 1, prev.results.length - 1)
        }))
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSearchState(prev => ({
          ...prev,
          selectedIndex: Math.max(prev.selectedIndex - 1, 0)
        }))
        break
      
      case 'Enter':
        e.preventDefault()
        if (searchState.selectedIndex >= 0 && searchState.results[searchState.selectedIndex]) {
          const selectedResult = searchState.results[searchState.selectedIndex]
          router.push(selectedResult.href)
          setSearchState(prev => ({
            ...prev,
            results: [],
            hasSearched: false,
            selectedIndex: -1
          }))
          inputRef.current?.blur()
        }
        break
      
      case 'Escape':
        e.preventDefault()
        setSearchState(prev => ({
          ...prev,
          results: [],
          hasSearched: false,
          selectedIndex: -1
        }))
        inputRef.current?.blur()
        break
    }
  }, [searchState.results, searchState.selectedIndex, router])

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && showShortcut) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    if (showShortcut) {
      document.addEventListener('keydown', handleGlobalKeyDown)
      return () => document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [showShortcut])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSearchState(prev => ({
          ...prev,
          results: [],
          hasSearched: false,
          selectedIndex: -1
        }))
        inputRef.current?.blur()
      }
    }

    if (searchState.hasSearched) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchState.hasSearched])

  // Handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setSearchState(prev => ({
      ...prev,
      query: newQuery,
      isSearching: newQuery.trim().length >= 2,
      selectedIndex: -1
    }))
  }, [])

  const handleResultSelect = useCallback((index: number) => {
    setSearchState(prev => ({ ...prev, selectedIndex: index }))
  }, [])

  const handleInputFocus = useCallback(() => {
    if (searchState.query.trim() && searchState.results.length > 0) {
      setSearchState(prev => ({ ...prev, hasSearched: true }))
    }
  }, [searchState.query, searchState.results.length])

  // Computed values
  const isSearchActive = searchState.hasSearched && (searchState.results.length > 0 || searchState.isSearching)
  const showResults = isSearchActive && searchState.query.trim().length >= 2

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchState.query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          autoFocus={autoFocus}
          className="pl-10 pr-16 py-4 text-lg border-gray-200 focus:border-gray-400 focus:ring-gray-400 rounded-lg transition-all duration-200"
        />
        
        {/* Keyboard shortcut hint */}
        {showShortcut && !searchState.query && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-gray-400">
            <Command className="h-3 w-3" />
            <span className="text-xs font-medium">K</span>
          </div>
        )}
        
        {/* Loading indicator */}
        {(searchState.isSearching || isPending) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <HelpSearchResults
          results={searchState.results}
          query={searchState.query}
          isSearching={searchState.isSearching}
          selectedIndex={searchState.selectedIndex}
          onResultSelect={handleResultSelect}
        />
      )}

      {/* Empty state when no query */}
      {searchState.query.trim().length >= 2 && searchState.hasSearched && !searchState.isSearching && searchState.results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6">
          <div className="text-center space-y-2">
            <Search className="h-8 w-8 text-gray-400 mx-auto" />
            <h3 className="text-sm font-medium text-gray-900">
              No results found for &quot;{searchState.query}&quot;
            </h3>
            <p className="text-xs text-gray-500">
              Try different keywords or browse the categories below
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 