import Link from 'next/link'
import { FileText, Users, Zap, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function QuickStartFooter() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          What&apos;s Next?
        </CardTitle>
        <CardDescription>
          Once you&apos;ve completed the basics, here are some advanced features to explore
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/templates"
            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
          >
            <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Explore Templates</h4>
            <p className="text-sm text-gray-600">Browse our template library</p>
          </Link>
          
          <Link
            href="/dashboard"
            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
          >
            <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Team Features</h4>
            <p className="text-sm text-gray-600">Collaborate with your team</p>
          </Link>
          
          <Link
            href="/settings?tab=integrations"
            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
          >
            <Zap className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Integrations</h4>
            <p className="text-sm text-gray-600">Connect external tools</p>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 