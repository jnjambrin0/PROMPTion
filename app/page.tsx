import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-blue-25">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-brand-gradient shadow-brand">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">Promption</span>
        </div>
        <nav className="ml-auto flex gap-3 sm:gap-4">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="bg-brand-gradient hover:opacity-90 text-white shadow-brand hover:shadow-brand-hover transition-all duration-200">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-6">
                  <span className="h-2 w-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  Your AI prompt organizer
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                  Organize Your Prompts{' '}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">
                    Like Never Before
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 leading-relaxed">
                  Promption is your personal Notion for AI prompts. Create, organize, and manage all your prompts in one beautiful, intuitive workspace that scales with your creativity.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-brand-gradient hover:opacity-90 text-white shadow-brand hover:shadow-brand-hover transition-all duration-200 transform hover:scale-105 px-8">
                  <Link href="/sign-up">Start Organizing</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-brand hover:shadow-brand-hover px-8">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white border-t border-gray-200">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
                Everything you need to master AI prompts
              </h2>
              <p className="mx-auto max-w-[600px] text-lg text-gray-600">
                Built for prompt engineers, content creators, and AI enthusiasts who want to stay organized.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-gray-25 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-card-hover">
                <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Smart Organization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Categorize and tag your prompts with an intuitive system. Create collections, use nested folders, and never lose track of your best prompts again.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-gray-25 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-card-hover">
                <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-purple-100 border border-purple-200">
                  <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Powerful Search</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find the perfect prompt instantly with full-text search, tag filtering, and smart suggestions. Your prompts are always just a search away.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-gray-25 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-card-hover">
                <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-green-100 border border-green-200">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Quick Access</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your favorite prompts with keyboard shortcuts, quick actions, and a streamlined interface designed for speed and efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-25 border-t border-gray-200">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                  Ready to organize your AI workflow?
                </h2>
                <p className="mx-auto max-w-[600px] text-lg text-gray-600">
                  Join thousands of prompt engineers and content creators who use Promption to stay organized and productive.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-brand-gradient hover:opacity-90 text-white shadow-brand hover:shadow-brand-hover transition-all duration-200 transform hover:scale-105 px-8">
                  <Link href="/sign-up">Get Started Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-500">
          © 2024 Promption. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-6 sm:gap-8">
          <Link className="text-sm hover:underline underline-offset-4 text-gray-500 hover:text-gray-700 transition-colors duration-200" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm hover:underline underline-offset-4 text-gray-500 hover:text-gray-700 transition-colors duration-200" href="#">
            Privacy Policy
          </Link>
          <Link className="text-sm hover:underline underline-offset-4 text-gray-500 hover:text-gray-700 transition-colors duration-200" href="#">
            Support
          </Link>
        </nav>
      </footer>
    </div>
  )
}
