import { BookOpen, Lightbulb } from 'lucide-react'
import { GuideCard } from './components/guide-card'

const GUIDES = [
  {
    title: 'Prompt Engineering 101',
    description: 'Learn the fundamentals of effective prompts. Master the basics of clear communication with AI systems.',
    time: '5 min read',
    level: 'Beginner' as const,
    href: '/guides/prompt-engineering-101'
  },
  {
    title: 'Advanced Techniques', 
    description: 'Chain-of-thought, few-shot learning, and advanced prompting strategies for complex tasks.',
    time: '10 min read',
    level: 'Advanced' as const, 
    href: '/guides/advanced-techniques'
  },
  {
    title: 'Organization Strategies',
    description: 'How to structure your prompt library for maximum efficiency and easy collaboration.',
    time: '7 min read',
    level: 'Intermediate' as const,
    href: '/guides/organization-strategies'
  },
  {
    title: 'Team Collaboration',
    description: 'Best practices for sharing prompts, managing permissions, and working with teams.', 
    time: '6 min read',
    level: 'Intermediate' as const,
    href: '/guides/team-collaboration'
  }
]

export default function GuidesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Guides
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master prompt engineering with our comprehensive guides. 
            Learn best practices, advanced techniques, and organizational strategies.
          </p>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">
              Pro Tip
            </h3>
            <p className="text-sm text-blue-800">
              Start with &quot;Prompt Engineering 101&quot; if you&apos;re new to prompting, 
              then progress through the guides based on your experience level.
            </p>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          All Guides
        </h2>
        <div className="grid gap-4">
          {GUIDES.map((guide) => (
            <GuideCard
              key={guide.href}
              title={guide.title}
              description={guide.description}
              time={guide.time}
              level={guide.level}
              href={guide.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 