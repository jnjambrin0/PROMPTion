import { Button } from '@/components/ui/button'

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      billing: "forever",
      description: "Perfect for getting started with prompt organization",
      features: [
        "Up to 50 prompts",
        "Basic organization",
        "Search functionality", 
        "Mobile access",
        "Community support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$12",
      billing: "per month",
      description: "Advanced features for serious prompt engineers",
      features: [
        "Unlimited prompts",
        "Advanced analytics",
        "Version history",
        "Template library",
        "Priority support",
        "Export functionality"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Team",
      price: "$39",
      billing: "per month",
      description: "Collaboration tools for prompt engineering teams",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared workspaces",
        "Advanced permissions",
        "Team analytics",
        "SSO integration",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="w-full py-16 md:py-24 lg:py-32 bg-gray-25">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            Start for free, upgrade when you need more. No hidden fees, no complex tiers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative flex flex-col p-8 rounded-xl border transition-all duration-200 ${
                plan.popular 
                  ? 'bg-white border-gray-300 shadow-card-hover scale-105' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-card-hover'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center justify-center px-4 py-1 bg-brand-gradient text-white text-xs font-medium rounded-full shadow-brand">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {plan.billing}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Features List */}
              <div className="flex-1 mb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-brand-gradient hover:opacity-90 text-white shadow-brand' 
                    : 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
                } transition-all duration-200`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Links */}
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-6">
            All plans include 14-day free trial. No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>30-day money back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Enterprise options available</span>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 p-8 bg-white rounded-xl border border-gray-200 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Need something more?
          </h3>
          <p className="text-gray-600 mb-6">
            Custom enterprise solutions with advanced security, compliance, and dedicated support.
          </p>
          <Button 
            variant="outline" 
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            Contact Enterprise Sales
          </Button>
        </div>
      </div>
    </section>
  )
} 