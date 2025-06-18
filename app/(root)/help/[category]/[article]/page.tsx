import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HelpBreadcrumbs } from '@/components/help'
import { getArticleBySlug, helpCategories } from '@/lib/constants/help-data'

interface ArticlePageProps {
  params: Promise<{
    category: string
    article: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, article } = await params
  const articleData = getArticleBySlug(category, article)

  if (!articleData) {
    notFound()
  }

  const categoryData = helpCategories.find(cat => cat.slug === category)
  if (!categoryData) {
    notFound()
  }

  // Find current article index for navigation
  const currentIndex = categoryData.articles.findIndex(a => a.slug === article)
  const prevArticle = currentIndex > 0 ? categoryData.articles[currentIndex - 1] : null
  const nextArticle = currentIndex < categoryData.articles.length - 1 ? categoryData.articles[currentIndex + 1] : null

  const breadcrumbItems = [
    { label: 'Help', href: '/help' },
    { label: categoryData.title, href: `/help/${categoryData.slug}` },
    { label: articleData.title }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <HelpBreadcrumbs 
          items={breadcrumbItems}
          showBackButton={true}
          backHref={`/help/${categoryData.slug}`}
        />

        {/* Article Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {articleData.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {articleData.description}
          </p>
          {articleData.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              Last updated: {articleData.lastUpdated}
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-gray max-w-none mb-12">
          <Card className="p-8 border-gray-200">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Article Content Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                This article is currently being written. The content will be available soon.
              </p>
              <p className="text-sm text-gray-500">
                In the meantime, you can explore other articles in this category or contact our support team.
              </p>
            </div>
          </Card>
        </div>

        {/* Article Navigation */}
        <div className="flex items-center justify-between gap-4 mb-12">
          {prevArticle ? (
            <Button variant="outline" asChild className="flex-1 max-w-xs">
              <Link href={`/help/${categoryData.slug}/${prevArticle.slug}`} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <div className="text-left min-w-0">
                  <div className="text-xs text-gray-500">Previous</div>
                  <div className="text-sm font-medium truncate">{prevArticle.title}</div>
                </div>
              </Link>
            </Button>
          ) : (
            <div className="flex-1 max-w-xs" />
          )}

          {nextArticle ? (
            <Button variant="outline" asChild className="flex-1 max-w-xs">
              <Link href={`/help/${categoryData.slug}/${nextArticle.slug}`} className="flex items-center gap-2">
                <div className="text-right min-w-0">
                  <div className="text-xs text-gray-500">Next</div>
                  <div className="text-sm font-medium truncate">{nextArticle.title}</div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div className="flex-1 max-w-xs" />
          )}
        </div>

        {/* Related Articles */}
        <Card className="p-6 bg-gray-50 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            More from {categoryData.title}
          </h3>
          <div className="space-y-2">
            {categoryData.articles
              .filter(a => a.slug !== articleData.slug)
              .slice(0, 3)
              .map((relatedArticle) => (
                <Link 
                  key={relatedArticle.slug}
                  href={`/help/${categoryData.slug}/${relatedArticle.slug}`}
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → {relatedArticle.title}
                </Link>
              ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Generate static params for all articles
export async function generateStaticParams() {
  const allParams: { category: string; article: string }[] = []
  
  helpCategories.forEach(category => {
    category.articles.forEach(article => {
      allParams.push({
        category: category.slug,
        article: article.slug,
      })
    })
  })
  
  return allParams
} 