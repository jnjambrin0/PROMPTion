import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 xl:py-40">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-6 max-w-4xl">
            {/* Status Badge */}
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700 mb-6">
              <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>
              Your personal Notion for AI prompts
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-tight">
              Organize Your AI Prompts{' '}
              <span className="bg-brand-gradient bg-clip-text text-white px-3 rounded-md">
                Like Never Before
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 leading-relaxed">
              Stop losing your best prompts in scattered notes. Promption gives you a beautiful, 
              organized workspace to create, store, and manage all your AI prompts in one place.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              asChild 
              className="bg-brand-gradient hover:opacity-90 text-white shadow-brand hover:shadow-brand-hover transition-all duration-200 transform hover:scale-105 px-8 h-12"
            >
              <Link href="/sign-up">Start Organizing</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-brand hover:shadow-brand-hover px-8 h-12"
            >
              <Link href="#demo">View Demo</Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="text-sm text-gray-500 mt-6">
            <p>No credit card required • 14-day free trial • 10,000+ prompts organized</p>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16 lg:mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
              <img
                src="/hero-workspace.svg"
                alt="Promption workspace interface showing organized prompts and collections"
                className="w-full h-auto block"
                loading="eager"
              />
            </div>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 