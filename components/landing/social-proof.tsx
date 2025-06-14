export function SocialProof() {
  const companies = [
    { name: 'Stripe', logo: '/logos/stripe.svg' },
    { name: 'Vercel', logo: '/logos/vercel.svg' },
    { name: 'Linear', logo: '/logos/linear.svg' },
    { name: 'Notion', logo: '/logos/notion.svg' },
    { name: 'OpenAI', logo: '/logos/openai.svg' },
    { name: 'Anthropic', logo: '/logos/anthropic.svg' }
  ]

  return (
    <section className="w-full py-12 md:py-16 bg-gray-25 border-t border-gray-200">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-gray-500 mb-8">
            Trusted by prompt engineers at leading companies
          </p>
          
          {/* Company Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 hover:opacity-80 transition-opacity duration-300">
            {companies.map((company) => (
              <div 
                key={company.name}
                className="flex items-center justify-center h-8 grayscale hover:grayscale-0 transition-all duration-200"
              >
                {/* Generic logo placeholder since we don't have actual logos */}
                <div className="h-6 px-4 flex items-center justify-center text-xs font-medium text-gray-400 border border-gray-200 rounded-md bg-white">
                  {company.name}
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
              <span>10,000+ prompts organized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
              <span>500+ teams collaborate daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
              <span>99.9% uptime guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 