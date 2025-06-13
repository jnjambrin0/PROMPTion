import { Metadata } from 'next'
import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
// import { SocialProof } from '@/components/landing/social-proof'
// import { FeaturesSection } from '@/components/landing/features-section'
// import { ProductDemo } from '@/components/landing/product-demo'
// import { BenefitsSection } from '@/components/landing/benefits-section'
// import { PricingSection } from '@/components/landing/pricing-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FAQSection } from '@/components/landing/faq-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'Promption - Your Personal Notion for AI Prompts',
  description: 'Organize, search, and manage all your AI prompts in one beautiful workspace. Stop losing your best prompts and transform your AI workflow.',
  keywords: ['AI prompts', 'prompt engineering', 'prompt management', 'AI tools', 'productivity', 'organization'],
  authors: [{ name: 'Promption Team' }],
  creator: 'Promption',
  publisher: 'Promption',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://promption.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Promption - Your Personal Notion for AI Prompts',
    description: 'Organize, search, and manage all your AI prompts in one beautiful workspace. Stop losing your best prompts and transform your AI workflow.',
    url: 'https://promption.com',
    siteName: 'Promption',
    images: [
      {
        url: '/hero-workspace.svg',
        width: 1200,
        height: 630,
        alt: 'Promption - AI Prompt Organization Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promption - Your Personal Notion for AI Prompts',
    description: 'Organize, search, and manage all your AI prompts in one beautiful workspace.',
    images: ['/hero-workspace.svg'],
    creator: '@promption',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Social Proof */}
        {/* <SocialProof /> */}
        
        {/* Features Section */}
        {/* <section id="features">
          <FeaturesSection />
        </section> */}
        
        {/* Product Demo */}
        {/* <ProductDemo /> */}
        
        {/* Benefits Section */}
        {/* <BenefitsSection /> */}
        
        {/* Pricing Section */}
        {/* <section id="pricing">
          <PricingSection />
        </section> */}
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* FAQ Section */}
        <section id="faq">
          <FAQSection />
        </section>
        
        {/* Final CTA */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
