'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId } from '@/lib/db';
import type { SearchResults, SearchResultItem } from '@/lib/types/search';
import type { Prompt, Workspace, Category } from '../generated/prisma';

type PromptWithRelations = Prompt & {
  workspace: { slug: string; name: string };
  category: { name: string } | null;
};

type CategoryWithRelations = Category & {
  workspace: { slug: string; name: string };
};

export async function searchGlobally(query: string): Promise<SearchResults> {
  const emptyResults: SearchResults = {
    prompts: [],
    workspaces: [],
    categories: [],
    templates: [],
  };

  if (!query || query.trim().length < 2) {
    return emptyResults;
  }

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    console.warn('Search attempt without authenticated user.');
    return emptyResults;
  }

  const user = await getUserByAuthId(authUser.id);
  if (!user) {
    console.warn('Authenticated user not found in database.');
    return emptyResults;
  }

  const trimmedQuery = query.trim();

  try {
    const [workspaces, categories, prompts] = await prisma.$transaction([
      // Workspaces
      prisma.workspace.findMany({
        where: {
          name: { contains: trimmedQuery, mode: 'insensitive' },
          members: { some: { userId: user.id } },
        },
      }),
      // Categories
      prisma.category.findMany({
        where: {
          name: { contains: trimmedQuery, mode: 'insensitive' },
          workspace: { members: { some: { userId: user.id } } },
        },
        include: { workspace: { select: { slug: true, name: true } } },
      }),
      // Prompts (and Templates)
      prisma.prompt.findMany({
        where: {
          title: { contains: trimmedQuery, mode: 'insensitive' },
          workspace: { members: { some: { userId: user.id } } },
          deletedAt: null,
        },
        include: {
          workspace: { select: { slug: true, name: true } },
          category: { select: { name: true } },
        },
      }),
    ]);

    // Map results
    const mappedPrompts = prompts
      .filter(p => !p.isTemplate)
      .map(mapPromptToSearchResult);

    const mappedTemplates = prompts
      .filter(p => p.isTemplate)
      .map(mapPromptToSearchResult);

    return {
      prompts: mappedPrompts,
      templates: mappedTemplates,
      workspaces: workspaces.map(mapWorkspaceToSearchResult),
      categories: categories.map(p => mapCategoryToSearchResult(p as CategoryWithRelations)),
    };
  } catch (error) {
    console.error('Error during global search:', error);
    return emptyResults;
  }
}

// --- Mappers ---

function mapWorkspaceToSearchResult(workspace: Workspace): SearchResultItem {
  return {
    id: workspace.id,
    title: workspace.name,
    url: `/${workspace.slug}`,
    breadcrumbs: ['Workspaces', workspace.name],
    type: 'workspace',
  };
}

function mapCategoryToSearchResult(
  category: CategoryWithRelations
): SearchResultItem {
  return {
    id: category.id,
    title: category.name,
    url: `/${category.workspace.slug}`, // TODO: Link to category tab
    breadcrumbs: ['Workspaces', category.workspace.name, 'Categories', category.name],
    type: 'category',
  };
}

function mapPromptToSearchResult(prompt: PromptWithRelations): SearchResultItem {
  const breadcrumbs = ['Workspaces', prompt.workspace.name];
  if (prompt.category) {
    breadcrumbs.push(prompt.category.name);
  }
  breadcrumbs.push(prompt.title);

  return {
    id: prompt.id,
    title: prompt.title,
    url: `/${prompt.workspace.slug}/${prompt.slug}`,
    breadcrumbs: breadcrumbs,
    type: prompt.isTemplate ? 'template' : 'prompt',
  };
} 