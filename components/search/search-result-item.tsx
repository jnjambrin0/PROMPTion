'use client';

import Link from 'next/link';
import {
  FileText,
  Library,
  Folder,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { ElementType } from 'react';
import type { SearchResultItem, SearchableEntityType } from '@/lib/types/search';
import { cn } from '@/lib/utils';

interface SearchResultItemProps {
  item: SearchResultItem;
}

const iconMap: Record<SearchableEntityType, ElementType> = {
  prompt: FileText,
  workspace: Library,
  category: Folder,
  template: Sparkles,
};

export function SearchResultItem({ item }: SearchResultItemProps) {
  const Icon = iconMap[item.type];

  return (
    <Link
      href={item.url}
      className={cn(
        'block p-3 rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'notion-hover'
      )}
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground truncate">
            {item.title}
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            {item.breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 mx-0.5" />
                )}
                <span className="truncate">{crumb}</span>
              </div>
            ))}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
      </div>
    </Link>
  );
} 