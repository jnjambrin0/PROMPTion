import { Mail, MessageCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm">
          <Link 
            href="/help"
              className="text-gray-600 hover:text-gray-900 transition-colors"
          >
              Help
          </Link>
            <span className="text-gray-400">•</span>
            <span className="text-gray-900 font-medium">Contact Support</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Contact Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Need personalized help? Our support team is here to assist you with any questions or issues you might have.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          <Card className="p-6 border-gray-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">
                  Send us a detailed message and we&apos;ll get back to you within 24 hours.
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:support@promption.dev" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    support@promption.dev
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Feedback */}
          <Card className="p-6 border-gray-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Feedback</h3>
                <p className="text-gray-600 mb-4">
                  Use our feedback widget for quick questions, bug reports, or feature requests.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Open Feedback Widget
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Look for the chat bubble in the bottom-right corner
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Before Contacting */}
        <Card className="p-6 bg-gray-50 border-gray-200 mb-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Before you contact us
              </h3>
              <p className="text-gray-600 mb-4">
                Check if your question is already answered in our help documentation. Most common issues can be resolved quickly using our guides.
              </p>
              <div className="space-y-2">
                <Link href="/help" className="block text-sm text-blue-600 hover:text-blue-800">
                  • Browse Help Center
                </Link>
                <Link href="/guides" className="block text-sm text-blue-600 hover:text-blue-800">
                  • Read User Guides
                </Link>
                <Link href="/help/getting-started/quick-start" className="block text-sm text-blue-600 hover:text-blue-800">
                  • Quick Start Guide
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Response Time */}
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Response Times
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
              <p className="text-sm text-gray-600">
                We typically respond within 24 hours during business days
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Feedback Widget</h4>
              <p className="text-sm text-gray-600">
                For bug reports and quick questions - usually same day
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 