import { FolderIcon, SearchIcon, ZapIcon } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: FolderIcon,
      title: "Smart Organization",
      description: "Create collections, use tags, and build a hierarchical structure that makes sense for your workflow. Never lose a prompt again."
    },
    {
      icon: SearchIcon,
      title: "Powerful Search",
      description: "Find any prompt instantly with full-text search, smart filtering, and contextual suggestions. Search by content, tags, or metadata."
    },
    {
      icon: ZapIcon,
      title: "Quick Access",
      description: "Keyboard shortcuts, quick actions, and streamlined workflows. Access your most-used prompts in seconds, not minutes."
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            Everything you need for prompt mastery
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            Built for prompt engineers, content creators, and AI enthusiasts who want to stay organized and productive.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-gray-25 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-card-hover notion-hover"
              >
                <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
                  <IconComponent className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 