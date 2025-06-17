import { Category, Prompt, Workspace } from '../generated/prisma';

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  breadcrumbs: string[];
  type: SearchableEntityType;
}

export interface SearchResults {
  prompts: SearchResultItem[];
  workspaces: SearchResultItem[];
  categories: SearchResultItem[];
  templates: SearchResultItem[];
}

// Helper types for processing raw Prisma data
export type SearchableEntity =
  | (Prompt & { workspace: { slug: string } })
  | Workspace
  | (Category & { workspace: { slug: string } });

export type SearchableEntityType =
  | 'prompt'
  | 'workspace'
  | 'category'
  | 'template'; 