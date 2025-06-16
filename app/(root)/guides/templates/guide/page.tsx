import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Lightbulb, Users, Star, Target } from 'lucide-react'
import Link from 'next/link'

export default function TemplateGuidePage() {
  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <Badge variant="secondary" className="mx-auto">
            Template Creation Guide
          </Badge>
          <h1 className="text-4xl font-bold text-neutral-900">
            How to Create Great Templates
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Learn how to build reusable, high-quality templates that help others achieve better results with AI prompts.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/templates/new">
              <Lightbulb className="h-4 w-4 mr-2" />
              Create Template
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/templates">
              Browse Examples
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* What Makes a Great Template */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">What Makes a Great Template?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Clear Purpose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Define exactly what problem your template solves and who should use it. 
                Be specific about the use case and expected outcomes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                User-Friendly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Make it easy for others to understand and customize. Include clear 
                instructions and placeholder variables that are self-explanatory.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Well-Tested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Test your template with different inputs and scenarios before sharing. 
                Ensure it produces consistent, high-quality results.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                Reusable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Design for flexibility. Use variables and modular components so others 
                can adapt your template to their specific needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Step-by-Step Creation Guide</h2>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">Plan Your Template</h3>
              <p className="text-neutral-600">
                Start by clearly defining the problem your template will solve. Research similar templates 
                and identify what makes yours unique. Write down the key components and structure.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-700 font-medium mb-2">Consider these questions:</p>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• What specific task will this template help with?</li>
                  <li>• Who is the target audience?</li>
                  <li>• What inputs will users need to provide?</li>
                  <li>• What kind of output should it generate?</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">Write Clear Instructions</h3>
              <p className="text-neutral-600">
                Create a compelling title and description that explains what your template does and how to use it. 
                Include any prerequisites or special considerations.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium mb-2">Good title examples:</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• &quot;Blog Post Writer - SEO Optimized Content&quot;</li>
                  <li>• &quot;Email Campaign Generator - High Converting&quot;</li>
                  <li>• &quot;Code Review Assistant - Security Focused&quot;</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">Build with Variables</h3>
              <p className="text-neutral-600">
                Use placeholder variables to make your template flexible. Choose clear, descriptive names 
                that make it obvious what users should input.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-800 font-medium mb-2">Variable naming best practices:</p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• {`{{PRODUCT_NAME}}`} instead of {`{{X}}`}</li>
                  <li>• {`{{TARGET_AUDIENCE}}`} instead of {`{{USERS}}`}</li>
                  <li>• {`{{MAIN_BENEFIT}}`} instead of {`{{BENEFIT1}}`}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">Test Thoroughly</h3>
              <p className="text-neutral-600">
                Test your template with various inputs to ensure it produces good results consistently. 
                Get feedback from others before making it public.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
              5
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">Publish and Iterate</h3>
              <p className="text-neutral-600">
                Make your template public, monitor its usage, and gather feedback. Update and improve 
                based on user feedback and new ideas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Categories */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Popular Template Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="font-semibold text-neutral-900 mb-1">Content Creation</h3>
            <p className="text-sm text-neutral-600">Blog posts, articles, social media content, marketing copy</p>
          </div>
          
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="text-2xl mb-2">💻</div>
            <h3 className="font-semibold text-neutral-900 mb-1">Development</h3>
            <p className="text-sm text-neutral-600">Code generation, documentation, testing, debugging</p>
          </div>
          
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-neutral-900 mb-1">Business</h3>
            <p className="text-sm text-neutral-600">Analysis, planning, proposals, presentations</p>
          </div>
          
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-semibold text-neutral-900 mb-1">Education</h3>
            <p className="text-sm text-neutral-600">Lesson plans, quizzes, explanations, study guides</p>
          </div>
          
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="text-2xl mb-2">🔬</div>
            <h3 className="font-semibold text-neutral-900 mb-1">Research</h3>
            <p className="text-sm text-neutral-600">Data analysis, summaries, literature reviews</p>
          </div>
          
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold text-neutral-900 mb-1">Creative</h3>
            <p className="text-sm text-neutral-600">Storytelling, brainstorming, design concepts</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-neutral-50 rounded-xl">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Ready to Create Your First Template?
          </h2>
          <p className="text-neutral-600 max-w-lg mx-auto">
            Start building a template that will help others achieve better results with AI. 
            Share your expertise with the community.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/templates/new">
              <Lightbulb className="h-5 w-5 mr-2" />
              Create Template Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
} 