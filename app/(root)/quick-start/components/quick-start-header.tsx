import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

export function QuickStartHeader() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/home"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Quick Start Guide
            </h1>
            <p className="text-gray-600">
              Get up and running with Promption in just a few minutes. Follow these steps to unlock the full potential of organized prompt management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 