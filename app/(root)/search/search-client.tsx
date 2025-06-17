'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { searchGlobally } from '@/lib/actions/search';
import type { SearchResults, SearchableEntityType } from '@/lib/types/search';
import { SearchResultsList } from '@/components/search/search-results-list';
import { SearchFilters } from '@/components/search/search-filters';

const emptyResults: SearchResults = {
  prompts: [],
  workspaces: [],
  categories: [],
  templates: [],
};

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [isSearching, startSearchTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState<SearchableEntityType | 'all'>('all');

  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTerm.length > 0 && searchTerm.length < 2) return;
    
    startSearchTransition(async () => {
      if (searchTerm.length === 0) {
        setResults(emptyResults);
      } else {
        const searchResults = await searchGlobally(searchTerm);
        setResults(searchResults);
      }
    });
  }, []);
  
  // Effect to update URL from input
  useEffect(() => {
    const newUrl = debouncedQuery ? `/search?q=${encodeURIComponent(debouncedQuery)}` : '/search';
    router.replace(newUrl, { scroll: false });
  }, [debouncedQuery, router]);
  
  // Effect to search when URL changes
  useEffect(() => {
    setQuery(urlQuery); // Sync input with URL
    handleSearch(urlQuery);
  }, [urlQuery, handleSearch]);

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search prompts, workspaces, templates..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-12 text-lg"
      />
      <SearchFilters 
        results={results}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <SearchResultsList
        query={debouncedQuery}
        results={results}
        isSearching={isSearching}
        activeFilter={activeFilter}
      />
    </div>
  );
}