import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HelpSearch, HelpCategoryCard } from '@/components/help'
import { helpCategories } from '@/lib/constants/help-data'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold text-gray-900">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to your questions, learn how to get the most out of Promption, 
            and discover best practices for prompt engineering.
          </p>
          
          {/* Search Component */}
          <div className="mt-8">
            <HelpSearch />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <HelpCategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
              <div className="space-y-2">
                <Link 
                  href="/help/getting-started/quick-start" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Quick Start Guide
                </Link>
                <Link 
                  href="/help/getting-started/first-workspace" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Creating Your First Workspace
                </Link>
                <Link 
                  href="/help/prompt-engineering/effective-prompts" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Writing Effective Prompts
                </Link>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Questions</h3>
              <div className="space-y-2">
                <Link 
                  href="/help/account-billing/upgrading-plan" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → How to upgrade my plan?
                </Link>
                <Link 
                  href="/help/team-collaboration/inviting-members" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → How to invite team members?
                </Link>
                <Link 
                  href="/help/troubleshooting/common-issues" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Troubleshooting common issues
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="p-8 bg-gray-50 border-gray-200 text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Still need help?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you get unstuck.
          </p>
          <Button variant="outline" asChild>
            <Link href="/help/contact" className="flex items-center gap-2">
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  )
} 