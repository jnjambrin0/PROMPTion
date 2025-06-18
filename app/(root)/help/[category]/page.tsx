import { notFound } from 'next/navigation'
import { HelpBreadcrumbs, HelpArticleCard } from '@/components/help'
import { getCategoryBySlug } from '@/lib/constants/help-data'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const Icon = category.icon

  const breadcrumbItems = [
    { label: 'Help', href: '/help' },
    { label: category.title }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <HelpBreadcrumbs 
          items={breadcrumbItems}
          showBackButton={true}
          backHref="/help"
        />

        {/* Category Header */}
        <div className="flex items-start gap-6 mb-12">
          <div className="h-16 w-16 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <Icon className="h-8 w-8 text-gray-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {category.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Articles ({category.articles.length})
          </h2>
          {category.articles.map((article) => (
            <HelpArticleCard 
              key={article.slug} 
              article={article} 
              categorySlug={category.slug}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Generate static params for all categories
export async function generateStaticParams() {
  const { helpCategories } = await import('@/lib/constants/help-data')
  
  return helpCategories.map((category) => ({
    category: category.slug,
  }))
} 