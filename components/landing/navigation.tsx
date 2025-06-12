import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' }
  ]

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container px-4 lg:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-brand-gradient shadow-brand">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Promption</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              asChild 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button 
              asChild 
              className="bg-brand-gradient hover:opacity-90 text-white shadow-brand hover:shadow-brand-hover transition-all duration-200"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 