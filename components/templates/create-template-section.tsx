import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Users, Award, Zap } from 'lucide-react'

interface CreateTemplateSectionProps {
  totalAuthors: number
}

export function CreateTemplateSection({ totalAuthors }: CreateTemplateSectionProps) {
  return (
    <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm">
              <Users className="h-4 w-4" />
              Join the Community
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Share your templates with the world
          </h2>
          
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Create templates that help others be more productive. Earn recognition, 
            build your reputation, and contribute to the growing AI community.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm">
              <Users className="h-6 w-6 text-neutral-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Build Community</h3>
            <p className="text-sm text-neutral-600">
              Help others discover and use your creative prompts and workflows
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm">
              <Award className="h-6 w-6 text-neutral-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Earn Recognition</h3>
            <p className="text-sm text-neutral-600">
              Get featured in our community showcase and build your profile
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm">
              <Zap className="h-6 w-6 text-neutral-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Stay Productive</h3>
            <p className="text-sm text-neutral-600">
              Organize your own templates and access them from anywhere
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            asChild
            className="bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900"
          >
            <Link href="/templates/new">
              <Plus className="h-4 w-4 mr-2" />
              Create your first template
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/templates/guide">
              Learn how to create templates
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="pt-6 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            Join <strong>{totalAuthors.toLocaleString()}+</strong> creators who have already shared their templates
          </p>
        </div>
      </div>
    </section>
  )
} 