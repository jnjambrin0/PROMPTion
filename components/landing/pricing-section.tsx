import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with prompt organization",
      features: [
        "Up to 50 prompts",
        "Basic organization",
        "Simple search",
        "Mobile app access",
        "Community support"
      ],
      cta: "Get Started",
      href: "/sign-up",
      popular: false
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "For serious prompt engineers and content creators",
      features: [
        "Unlimited prompts",
        "Advanced organization",
        "Powerful search & filters",
        "Version history",
        "Export & backup",
        "Priority support",
        "Analytics dashboard",
        "API access"
      ],
      cta: "Start Free Trial",
      href: "/sign-up?plan=pro",
      popular: true
    },
    {
      name: "Team",
      price: "$39",
      period: "per month",
      description: "For teams collaborating on AI prompt workflows",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared workspaces",
        "Role-based permissions",
        "Team analytics",
        "Advanced integrations",
        "Custom branding",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-25">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            Choose the plan that fits your workflow. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative flex flex-col p-8 bg-white rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-200 ${
                plan.popular 
                  ? 'border-gray-300 ring-2 ring-gray-200' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gray-900 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                asChild 
                className={
                  plan.popular 
                    ? "w-full bg-brand-gradient hover:opacity-90 text-white shadow-brand hover:shadow-brand-hover"
                    : "w-full border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            All plans include a 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
} 