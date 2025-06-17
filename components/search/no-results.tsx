import { Search } from 'lucide-react';

interface NoResultsProps {
  query: string;
}

export function NoResults({ query }: NoResultsProps) {
  if (!query) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium text-foreground">
          Find what you need
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Start typing to search across all of your content.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-medium text-foreground">
        No results for &quot;{query}&quot;
      </h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Try a different search term or check your spelling.
      </p>
    </div>
  );
} 