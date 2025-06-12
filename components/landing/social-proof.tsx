export function SocialProof() {
  const stats = [
    { value: "10,000+", label: "Prompts Organized" },
    { value: "2,500+", label: "Active Users" },
    { value: "500+", label: "Companies" },
    { value: "99.9%", label: "Uptime" }
  ]

  const companies = [
    "Stripe", "Vercel", "Linear", "Notion", "Figma", "OpenAI"
  ]

  return (
    <section className="py-12 border-y border-gray-100 bg-gray-25">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Stats */}
        <div className="flex flex-col items-center space-y-8">
          <p className="text-center text-sm text-gray-500">
            Trusted by prompt engineers worldwide
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-2xl">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Company Names */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {companies.map((company, index) => (
                <div 
                  key={index}
                  className="text-lg font-medium text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 