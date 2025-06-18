import Link from 'next/link'
import { ChevronRight, ArrowLeft } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface HelpBreadcrumbsProps {
  items: BreadcrumbItem[]
  showBackButton?: boolean
  backHref?: string
}

export function HelpBreadcrumbs({ items, showBackButton = false, backHref }: HelpBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      {showBackButton && backHref && (
        <Link 
          href={backHref}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      )}
      
      <nav className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-gray-400" />
            )}
            {item.href ? (
              <Link 
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
} 