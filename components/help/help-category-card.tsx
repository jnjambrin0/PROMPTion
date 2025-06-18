import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { HelpCategory } from '@/lib/types/help'

interface HelpCategoryCardProps {
  category: HelpCategory
}

export function HelpCategoryCard({ category }: HelpCategoryCardProps) {
  const Icon = category.icon

  return (
    <Link href={`/help/${category.slug}`} className="block">
      <Card className="p-6 h-full border-gray-200 notion-hover transition-all duration-200 hover:shadow-md group">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
            <Icon className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
              {category.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {category.description}
            </p>
            <div className="text-xs text-gray-500">
              {category.articles.length} {category.articles.length === 1 ? 'article' : 'articles'}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
} 