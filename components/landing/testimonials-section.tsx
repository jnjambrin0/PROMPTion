import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function TestimonialsSection() {
  const testimonials = [
    {
      content: "Promption completely transformed how I manage my AI workflows. I went from losing prompts in scattered notes to having everything organized and searchable. The time I save daily is incredible.",
      author: {
        name: "Sarah Chen",
        role: "Product Manager",
        company: "Stripe",
        avatar: "/avatars/sarah.jpg",
        initials: "SC"
      }
    },
    {
      content: "As a content creator working with multiple AI tools, Promption became my command center. The organization features and quick search mean I can find the perfect prompt in seconds.",
      author: {
        name: "Marcus Rodriguez",
        role: "AI Content Strategist",
        company: "Linear",
        avatar: "/avatars/marcus.jpg",
        initials: "MR"
      }
    },
    {
      content: "The analytics dashboard helped me understand which prompts work best for different scenarios. It's like having a data-driven approach to prompt engineering. Game changer for our team.",
      author: {
        name: "Emily Thompson",
        role: "ML Engineer",
        company: "Vercel",
        avatar: "/avatars/emily.jpg",
        initials: "ET"
      }
    },
    {
      content: "Finally, a tool that treats prompts with the respect they deserve. The version history and collaboration features make it perfect for our prompt engineering team.",
      author: {
        name: "David Kim",
        role: "AI Research Lead",
        company: "Notion",
        avatar: "/avatars/david.jpg",
        initials: "DK"
      }
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            Loved by prompt engineers worldwide
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            See what our users say about transforming their AI workflows with Promption.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="flex flex-col p-6 bg-gray-25 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-card-hover"
            >
              {/* Quote */}
              <div className="flex-1 mb-6">
                <blockquote className="text-gray-700 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </blockquote>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={testimonial.author.avatar} 
                    alt={testimonial.author.name} 
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                    {testimonial.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.author.role} at {testimonial.author.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 