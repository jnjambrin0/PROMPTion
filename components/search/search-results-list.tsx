import { SearchResultGroup } from './search-result-group';
import { NoResults } from './no-results';
import { Skeleton } from '@/components/ui/skeleton';
import type { SearchResults, SearchableEntityType } from '@/lib/types/search';

interface SearchResultsListProps {
  query: string;
  results: SearchResults;
  isSearching: boolean;
  activeFilter: SearchableEntityType | 'all';
}

function LoadingSkeleton() {
    return (
      <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
}

export function SearchResultsList({ query, results, isSearching, activeFilter }: SearchResultsListProps) {
  const hasResults =
    results.workspaces.length > 0 ||
    results.categories.length > 0 ||
    results.prompts.length > 0 ||
    results.templates.length > 0;

  if (isSearching) {
    return <LoadingSkeleton />;
  }
  
  if (!hasResults) {
    return <NoResults query={query} />;
  }

  const showAll = activeFilter === 'all';

  return (
    <div className="space-y-6">
      {(showAll || activeFilter === 'workspace') && <SearchResultGroup title="Workspaces" items={results.workspaces} />}
      {(showAll || activeFilter === 'category') && <SearchResultGroup title="Categories" items={results.categories} />}
      {(showAll || activeFilter === 'prompt') && <SearchResultGroup title="Prompts" items={results.prompts} />}
      {(showAll || activeFilter === 'template') && <SearchResultGroup title="Templates" items={results.templates} />}
    </div>
  );
} 