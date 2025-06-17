'use client';

import { Badge } from '@/components/ui/badge';
import type { SearchResults, SearchableEntityType } from '@/lib/types/search';

type FilterType = SearchableEntityType | 'all';

interface SearchFiltersProps {
  results: SearchResults;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

const filterOptions: { id: FilterType; label: string; key: keyof SearchResults | 'all' }[] = [
    { id: 'all', label: 'All', key: 'all' },
    { id: 'workspace', label: 'Workspaces', key: 'workspaces' },
    { id: 'category', label: 'Categories', key: 'categories' },
    { id: 'prompt', label: 'Prompts', key: 'prompts' },
    { id: 'template', label: 'Templates', key: 'templates' },
];

export function SearchFilters({ results, activeFilter, setActiveFilter }: SearchFiltersProps) {
  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  if (totalResults === 0) {
    return null;
  }

  const getCount = (key: keyof SearchResults | 'all') => {
    if (key === 'all') return totalResults;
    return results[key]?.length || 0;
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => {
        const count = getCount(option.key);
        if (count === 0 && option.id !== 'all') return null;

        return (
          <Badge
            key={option.id}
            variant={activeFilter === option.id ? 'default' : 'outline'}
            onClick={() => setActiveFilter(option.id)}
            className="cursor-pointer transition-colors"
          >
            {option.label}
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
              {count}
            </span>
          </Badge>
        );
      })}
    </div>
  );
} 