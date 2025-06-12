import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from './button'

interface CreateFormLayoutProps {
  title: string
  subtitle: string
  backHref: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function CreateFormLayout({
  title,
  subtitle,
  backHref,
  children,
  actions
}: CreateFormLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-25">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 pt-1">
              <Link href={backHref}>
                <Button variant="ghost" size="sm" className="gap-2 -ml-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 mt-1 pr-4">{subtitle}</p>
            </div>

            {actions && (
              <div className="flex items-center gap-3 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs">
          {children}
        </div>
      </main>
    </div>
  )
} 