export function BenefitsSection() {
  const benefits = [
    {
      title: "Save Hours Every Week",
      description: "Stop hunting through scattered notes and docs. Find any prompt in seconds with intelligent search and organization.",
      metric: "75%",
      metricLabel: "time saved on prompt management",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Never Lose a Great Prompt Again",
      description: "Version control and automatic backups ensure your best prompts are always safe and accessible.",
      metric: "100%",
      metricLabel: "prompt recovery rate",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    },
    {
      title: "Boost Team Productivity",
      description: "Share templates, collaborate on prompts, and build institutional knowledge that scales with your team.",
      metric: "3x",
      metricLabel: "faster onboarding for new team members",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      )
    }
  ]

  const stats = [
    { value: "10,000+", label: "Prompts organized" },
    { value: "500+", label: "Teams using daily" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "2min", label: "Average setup time" }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            Why teams choose Promption
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            Join thousands of prompt engineers and AI teams who&apos;ve transformed their workflows with organized, accessible prompt management.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-12 lg:gap-16 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gray-25 border border-gray-200 text-gray-600 mb-6 shadow-xs">
                  {benefit.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-neutral-600">
                  {benefit.description}
                </p>
                
                {/* Metric */}
                <div className="inline-flex flex-col items-center lg:items-start">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {benefit.metric}
                  </div>
                  <div className="text-sm text-gray-500">
                    {benefit.metricLabel}
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 max-w-md">
                <div className="aspect-square rounded-xl border border-gray-200 bg-gray-25 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="h-16 w-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
                      {benefit.icon}
                    </div>
                    <p className="text-sm text-gray-500">Interactive visualization</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gray-25 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to experience these benefits?
          </h3>
          <p className="text-gray-600 mb-6">
            Start organizing your prompts today with our free 14-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-brand cursor-pointer">
              Start Free Trial
            </div>
            <div className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 hover:shadow-card-hover transition-all duration-200 font-medium cursor-pointer">
              Schedule Demo
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 