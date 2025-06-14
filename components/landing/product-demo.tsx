export function ProductDemo() {
  const demoSteps = [
    {
      step: "01",
      title: "Create & Organize",
      description: "Build your prompt library with collections, tags, and smart categorization."
    },
    {
      step: "02", 
      title: "Search & Discover",
      description: "Find the perfect prompt instantly with powerful search and filtering."
    },
    {
      step: "03",
      title: "Collaborate & Share",
      description: "Work together with your team and share your best prompts securely."
    }
  ]

  return (
    <section id="demo" className="w-full py-16 md:py-24 lg:py-32 bg-gray-25">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            See Promption in action
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            Watch how easy it is to organize, search, and manage your AI prompts in a beautiful, intuitive workspace.
          </p>
        </div>

        {/* Demo Video/Screenshot */}
        <div className="relative mx-auto max-w-5xl mb-16">
          <div className="relative rounded-xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
            {/* Placeholder for demo screenshot */}
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-lg bg-brand-gradient flex items-center justify-center mx-auto mb-4 shadow-brand">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Interactive Demo Coming Soon</p>
                <p className="text-sm text-gray-400 mt-2">Experience the full Promption workspace</p>
              </div>
            </div>
            
            {/* Demo annotations */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                Live Workspace
              </div>
            </div>
          </div>
        </div>

        {/* Demo Steps */}
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {demoSteps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number */}
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-white border border-gray-200 text-gray-600 font-semibold mb-4 shadow-xs">
                {step.step}
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-6">Ready to experience the difference?</p>
          <div className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <span className="text-sm font-medium text-gray-700 mr-2">Request a personalized demo</span>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
} 