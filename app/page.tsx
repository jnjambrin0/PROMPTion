import { Metadata } from 'next'
import {
  Navigation,
  HeroSection,
  SocialProof,
  FeaturesSection,
  ProductDemo,
  BenefitsSection,
  PricingSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
  Footer
} from '@/components/landing'

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

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <ProductDemo />
        <BenefitsSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
