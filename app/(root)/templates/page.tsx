import { TemplatesHeader } from '@/components/templates/templates-header'
import { TemplatesStats } from '@/components/templates/templates-stats'
import { FeaturedTemplates } from '@/components/templates/featured-templates'
import { TemplateCategories } from '@/components/templates/template-categories'
import { CommunityTemplates } from '@/components/templates/community-templates'
import { CreateTemplateSection } from '@/components/templates/create-template-section'

import { 
  getPublicTemplates, 
  getFeaturedTemplates, 
  getTemplateCategories, 
  getTemplateStats 
} from '@/lib/db/templates'

// OPTIMIZACIÓN: Cache estático para evitar queries repetidas
export const revalidate = 300 // 5 minutos de cache

interface PageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    view?: string
    page?: string
  }>
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  // Await searchParams antes de usar sus propiedades
  const params = await searchParams
  
  // Preparar filtros para la query de templates
  const filters = {
    categoryId: params.category && params.category !== 'all' 
      ? params.category 
      : undefined,
    search: params.search,
    sort: (params.sort as 'popular' | 'recent' | 'favorites' | 'alphabetical') || 'popular',
    page: parseInt(params.page || '1'),
    limit: 12
  }

  try {
    // OPTIMIZACIÓN: Fetch paralelo con mejor manejo de errores
    const dataFetches = await Promise.allSettled([
      getPublicTemplates(filters),
      getFeaturedTemplates(),
      getTemplateCategories(),
      getTemplateStats()
    ])

    // Manejar resultados con fallbacks
    const [templatesResult, featuredResult, categoriesResult, statsResult] = dataFetches

    const { templates: communityTemplates, totalCount, hasMore } = 
      templatesResult.status === 'fulfilled' 
        ? templatesResult.value 
        : { templates: [], totalCount: 0, hasMore: false }

    const featuredTemplates = 
      featuredResult.status === 'fulfilled' 
        ? featuredResult.value 
        : []

    const rawCategories = 
      categoriesResult.status === 'fulfilled' 
        ? categoriesResult.value 
        : []

    const stats = 
      statsResult.status === 'fulfilled' 
        ? statsResult.value 
        : { totalTemplates: 0, totalAuthors: 0, totalUsage: 0, featuredCount: 0 }

    // Mapear categorías al formato esperado
    const categories = rawCategories.map(category => ({
      id: category.id,
      name: category.name,
      count: category._count.prompts,
      icon: category.icon || null
    }))

    return (
      <div className="flex-1 p-6 space-y-12 max-w-7xl mx-auto">
        <TemplatesHeader />
        
        <TemplatesStats 
          totalTemplates={stats.totalTemplates}
          totalAuthors={stats.totalAuthors}
          totalUsage={stats.totalUsage}
          featuredCount={stats.featuredCount}
        />

        {featuredTemplates.length > 0 && (
          <FeaturedTemplates 
            templates={featuredTemplates}
          />
        )}

        <TemplateCategories 
          categories={categories}
          selectedCategory={params.category}
        />

        <CommunityTemplates
          templates={communityTemplates}
          searchParams={params}
          hasMore={hasMore}
          totalCount={totalCount}
        />

        <CreateTemplateSection totalAuthors={stats.totalAuthors} />
      </div>
    )
  } catch (error) {
    console.error('Error loading templates:', error)
    
    // Fallback UI optimizado
    return (
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Unable to load templates
          </h3>
          <p className="text-neutral-600 mb-4">
            There was an error loading the templates. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-neutral-900 hover:text-neutral-600"
          >
            Refresh page
          </button>
        </div>
      </div>
    )
  }
} 