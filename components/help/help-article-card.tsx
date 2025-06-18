import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { HelpArticle } from '@/lib/types/help'
import { ChevronRight } from 'lucide-react'

interface HelpArticleCardProps {
  article: HelpArticle
  categorySlug: string
}

export function HelpArticleCard({ article, categorySlug }: HelpArticleCardProps) {
  return (
    <Link href={`/help/${categorySlug}/${article.slug}`} className="block">
      <Card className="p-4 border-gray-200 notion-hover transition-all duration-200 hover:shadow-md group">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {article.description}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-4 group-hover:text-gray-600 transition-colors" />
        </div>
      </Card>
    </Link>
  )
} 