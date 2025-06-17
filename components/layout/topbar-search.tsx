'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function TopbarSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query, 500);

  const isSearchPage = pathname === '/search';

  const handleNavigate = (searchTerm: string) => {
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query) {
      e.preventDefault();
      // On the search page, the main input's debouncer will handle it.
      // From other pages, we navigate immediately on Enter.
      if (!isSearchPage) {
        handleNavigate(query);
      }
    }
  };

  // Effect to navigate when debounced query changes, BUT ONLY if not on search page
  useEffect(() => {
    if (!isSearchPage && debouncedQuery.length > 0 && debouncedQuery !== urlQuery) {
      handleNavigate(debouncedQuery);
    }
  }, [debouncedQuery, urlQuery, isSearchPage]);

  // Effect to sync input with URL changes (e.g., from SearchClient)
  useEffect(() => {
    // Avoid re-setting the query if the user is typing in this specific input
    if (query !== urlQuery) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        type="search"
        placeholder="Search prompts, templates, workspaces..."
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2 pl-9 pr-3 text-sm placeholder:text-neutral-500 focus:border-neutral-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all duration-200"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
} 