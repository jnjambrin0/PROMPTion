import Link from 'next/link'
import { FileText, Folder, Users, BookOpen, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface QuickStartSectionsProps {
  primaryWorkspace: { slug: string } | null
}

const TEMPLATES = [
  {
    title: 'Content Creation',
    description: 'Blog posts, social media, marketing copy',
    prompts: 12,
    popular: true,
    href: '/templates?category=content-creation'
  },
  {
    title: 'Code Assistant', 
    description: 'Programming, debugging, code review',
    prompts: 8,
    popular: true,
    href: '/templates?category=code-assistant'
  },
  {
    title: 'Research & Analysis',
    description: 'Data analysis, research summaries', 
    prompts: 6,
    popular: false,
    href: '/templates?category=research-analysis'
  },
  {
    title: 'Creative Writing',
    description: 'Stories, poetry, creative content',
    prompts: 10, 
    popular: false,
    href: '/templates?category=creative-writing'
  }
]

const GUIDES = [
  {
    title: 'Prompt Engineering 101',
    description: 'Learn the fundamentals of effective prompts',
    time: '5 min read',
    level: 'Beginner',
    href: '/guides/prompt-engineering-101'
  },
  {
    title: 'Advanced Techniques', 
    description: 'Chain-of-thought, few-shot learning, and more',
    time: '10 min read',
    level: 'Advanced', 
    href: '/guides/advanced-techniques'
  },
  {
    title: 'Organization Strategies',
    description: 'How to structure your prompt library',
    time: '7 min read',
    level: 'Intermediate',
    href: '/guides/organization-strategies'
  },
  {
    title: 'Team Collaboration',
    description: 'Sharing and collaborating on prompts', 
    time: '6 min read',
    level: 'Intermediate',
    href: '/guides/team-collaboration'
  }
]

const QUICK_ACTIONS = [
  {
    title: 'Create your first prompt',
    description: 'Build your first prompt from scratch',
    href: '/prompts/new',
    icon: FileText,
    buttonText: 'Get Started'
  },
  {
    title: 'Set up collections', 
    description: 'Organize prompts by topic or project',
    href: '/collections/new',
    icon: Folder,
    buttonText: 'Create Collection'
  },
  {
    title: 'Invite team members',
    description: 'Collaborate with your team', 
    icon: Users,
    buttonText: 'Invite Members'
  },
  {
    title: 'Explore templates',
    description: 'Browse our template library',
    href: '/templates',
    icon: ArrowRight,
    buttonText: 'Browse Templates'
  }
]

export function QuickStartSections({ primaryWorkspace }: QuickStartSectionsProps) {
  return (
    <div className="space-y-8">
      {/* Templates Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 border-blue-200 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Start with Templates</CardTitle>
              <CardDescription className="mt-1">
                Jump-start your workflow with proven prompt templates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {TEMPLATES.map((template) => (
              <Link
                key={template.title}
                href={template.href}
                className="group block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-gray-700">
                    {template.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {template.popular && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {template.prompts} prompts
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {template.description}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guides Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 border-green-200 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Learn Best Practices</CardTitle>
              <CardDescription className="mt-1">
                Master prompt engineering with our guides
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {GUIDES.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700">
                      {guide.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {guide.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {guide.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{guide.time}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 border-purple-200 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription className="mt-1">
                Get started immediately with these actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const ActionIcon = action.icon
              const href = action.title === 'Invite team members' && primaryWorkspace 
                ? `/${primaryWorkspace.slug}?tab=members` 
                : action.href || '/workspaces/new'
              
              return (
                <div
                  key={action.title}
                  className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center">
                        <ActionIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" className="flex-1 w-full" asChild>
                    <Link href={href}>
                      {action.buttonText}
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 