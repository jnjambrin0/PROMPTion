import { CheckIcon } from 'lucide-react'

export function BenefitsSection() {
  const benefits = [
    {
      title: "Stop losing your best prompts",
      description: "No more scattered notes, forgotten conversations, or lost prompt masterpieces. Organize everything in collections, tag what matters, and find any prompt in seconds.",
      image: "/benefit-organization.svg",
      features: [
        "Hierarchical collections and folders",
        "Smart tagging system",
        "Custom metadata fields",
        "Automatic prompt categorization"
      ],
      reversed: false
    },
    {
      title: "Track what works, improve what doesn't",
      description: "Get insights into your prompt performance, usage patterns, and effectiveness. Data-driven prompt engineering that helps you craft better prompts over time.",
      image: "/benefit-analytics.svg",
      features: [
        "Usage analytics and metrics",
        "Performance tracking",
        "Version history and comparisons",
        "Export and backup options"
      ],
      reversed: true
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            Transform your AI workflow
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            From chaos to clarity. See how Promption transforms the way you work with AI prompts.
          </p>
        </div>

        <div className="space-y-24">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`grid gap-12 lg:gap-16 lg:grid-cols-2 items-center ${
                benefit.reversed ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${benefit.reversed ? 'lg:col-start-2' : ''}`}>
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
                
                <ul className="space-y-3">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <div className={`${benefit.reversed ? 'lg:col-start-1' : ''}`}>
                <div className="relative">
                  <div className="relative rounded-xl shadow-xl border border-gray-200 bg-white overflow-hidden">
                    <img
                      src={benefit.image}
                      alt={`${benefit.title} - Promption benefit illustration`}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/5 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 