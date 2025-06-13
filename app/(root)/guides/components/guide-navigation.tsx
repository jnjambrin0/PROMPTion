import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

export function GuideNavigation() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/quick-start"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quick Start
            </Link>
            <div className="text-gray-300">/</div>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <BookOpen className="h-4 w-4" />
              Guides
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 