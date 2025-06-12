import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 leading-tight">
              Ready to transform your{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                AI workflow?
              </span>
            </h2>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 leading-relaxed">
              Join thousands of prompt engineers, content creators, and AI enthusiasts who've already 
              made the switch to organized, efficient prompt management.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              asChild 
              className="bg-brand-gradient hover:opacity-90 text-white shadow-brand hover:shadow-brand-hover transition-all duration-200 transform hover:scale-105 px-8 h-12"
            >
              <Link href="/sign-up">Start Your Free Trial</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-brand hover:shadow-brand-hover px-8 h-12"
            >
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 mt-8">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 