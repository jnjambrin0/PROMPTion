import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'

export function TemplatesHeader() {
  return (
    <div className="text-center space-y-6">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
          <Sparkles className="h-4 w-4" />
          Template Library
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
          Discover powerful templates
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
          Browse community-created templates, get inspired, and build your own. 
          Transform your AI workflow with proven prompts and workflows.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button 
          variant="outline" 
          asChild
          className="bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900"
        >
          <Link href="/templates/new">
            <Plus className="h-4 w-4 mr-2" />
            Create template
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="#community">
            Browse community
          </Link>
        </Button>
      </div>
    </div>
  )
} 