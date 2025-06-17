import type { SearchResultItem as SearchResultItemType } from '@/lib/types/search';
import { SearchResultItem } from './search-result-item';

interface SearchResultGroupProps {
  title: string;
  items: SearchResultItemType[];
}

export function SearchResultGroup({ title, items }: SearchResultGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-3">
        {title}
      </h2>
      <div className="space-y-1">
        {items.map((item) => (
          <SearchResultItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
} 