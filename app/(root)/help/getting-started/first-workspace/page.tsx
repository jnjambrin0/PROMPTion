import Link from 'next/link'
import { Calendar, CheckCircle, ArrowRight, Users, Settings, FolderPlus, AlertTriangle, Lightbulb, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HelpBreadcrumbs } from '@/components/help'

export default function FirstWorkspacePage() {
  const breadcrumbItems = [
    { label: 'Help', href: '/help' },
    { label: 'Getting Started', href: '/help/getting-started' },
    { label: 'Creating Your First Workspace' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <HelpBreadcrumbs 
          items={breadcrumbItems}
          showBackButton={true}
          backHref="/help/getting-started"
        />

        {/* Article Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Creating Your First Workspace
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Your workspace is the foundation of your Promption experience. It&apos;s where your team collaborates, organizes prompts, and builds AI-powered workflows. This comprehensive guide will walk you through setting up your first workspace for maximum productivity.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Last updated: January 2025
          </div>
        </div>

        {/* What is a Workspace */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What is a Workspace?</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            A workspace is a shared environment where you and your team can create and organize prompts by project or use case, collaborate with team members in real-time, set up categories and collections for better organization, control access permissions and visibility, and track usage and performance metrics.
          </p>

          <Card className="p-6 bg-blue-50 border-blue-200 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 mt-0.5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Think of it as Your Team&apos;s AI Laboratory</h4>
                <p className="text-sm text-blue-800">
                  A workspace is a dedicated place where ideas become structured, reusable prompts. It&apos;s where your team&apos;s collective AI knowledge lives and grows.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Before You Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Before You Start</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Active Promption account
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Team email addresses (if adding members)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Clear understanding of your use case
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Planning Questions</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Purpose:</strong> What will this workspace be used for?</p>
                <p><strong>Team Size:</strong> How many people will need access?</p>
                <p><strong>Organization:</strong> How will you categorize prompts?</p>
                <p><strong>Permissions:</strong> Who needs editing vs. viewing access?</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Creation Process</h2>

          {/* Step 1 */}
          <Card className="p-6 border-gray-200 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Access the Creation Form</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Navigate to your dashboard and click &quot;Create Workspace&quot; or visit <code className="bg-gray-100 px-2 py-1 rounded text-sm">/workspaces/new</code>. You&apos;ll need to be signed in to proceed.
            </p>
            <Button variant="outline" asChild>
              <Link href="/workspaces/new" className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Your First Workspace
              </Link>
            </Button>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 border-gray-200 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Workspace Name</h4>
                <ul className="space-y-1 text-sm text-gray-600 ml-4">
                  <li>• Choose a descriptive, memorable name</li>
                  <li>• Keep it under 50 characters</li>
                  <li>• Examples: &quot;Marketing Team&quot;, &quot;Product Development&quot;, &quot;Customer Success Hub&quot;</li>
                  <li>• Avoid generic names like &quot;My Workspace&quot;</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description (Optional but Recommended)</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Explain the workspace&apos;s purpose in 1-2 sentences. Help team members understand the scope and include primary use cases or goals. Maximum 200 characters.
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                  <strong>Example descriptions:</strong><br/>
                  • &quot;AI prompts for content marketing campaigns and social media&quot;<br/>
                  • &quot;Engineering team prompts for code review, documentation, and debugging&quot;<br/>
                  • &quot;Customer support templates for common inquiries and escalations&quot;
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 border-gray-200 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">URL Customization (Advanced)</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Your workspace gets a unique URL: <code className="bg-gray-100 px-2 py-1 rounded text-sm">promption.com/your-workspace-name</code>
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Auto-Generated Slugs</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Promption automatically creates URL-friendly slugs from your workspace name:
                </p>
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                  • &quot;Marketing Team&quot; → &quot;marketing-team&quot;<br/>
                  • &quot;Product Development&quot; → &quot;product-development&quot;
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Custom Slugs</h4>
                <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                <ul className="space-y-1 text-sm text-gray-600 ml-4">
                  <li>• Must be 3-30 characters</li>
                  <li>• Only lowercase letters, numbers, and hyphens</li>
                  <li>• Must be unique across all Promption workspaces</li>
                  <li>• Cannot be changed after creation</li>
                </ul>
              </div>
            </div>

            <Card className="p-4 bg-yellow-50 border-yellow-200 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-600" />
                <div>
                  <h5 className="font-medium text-yellow-900 text-sm">Best Practices for URLs</h5>
                  <ul className="text-xs text-yellow-800 mt-1 space-y-1">
                    <li>• Keep it short and memorable</li>
                    <li>• Use your company/team abbreviation</li>
                    <li>• Avoid special characters or spaces</li>
                    <li>• Consider future team growth</li>
                  </ul>
                </div>
              </div>
            </Card>
          </Card>

          {/* Step 4 */}
          <Card className="p-6 border-gray-200 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Review and Create</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Double-check all information before clicking &quot;Create workspace&quot;. You&apos;ll be redirected to your new workspace immediately.
            </p>
          </Card>
        </section>

        {/* Post-Creation Setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Post-Creation Setup</h2>

          <Card className="p-6 bg-green-50 border-green-200 mb-6">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 mt-0.5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Immediate Next Steps</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span><strong>Create Your First Category:</strong> Visit the Categories tab and start with broad categories</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span><strong>Invite Team Members:</strong> Go to Members tab and add email addresses with appropriate permissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span><strong>Create Your First Prompt:</strong> Click &quot;New Prompt&quot; and test the creation workflow</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Category Structure</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Marketing</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Content Creation</li>
                  <li>• Social Media</li>
                  <li>• Email Campaigns</li>
                  <li>• SEO & Analytics</li>
                </ul>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Engineering</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Code Review</li>
                  <li>• Documentation</li>
                  <li>• Bug Reports</li>
                  <li>• Architecture</li>
                </ul>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Customer Success</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Onboarding</li>
                  <li>• Troubleshooting</li>
                  <li>• Feature Requests</li>
                  <li>• Escalation</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Workspace Settings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Workspace Settings Configuration</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Name & Description:</strong> Can be updated anytime</li>
                <li>• <strong>Visibility:</strong> Private (default) or Public</li>
                <li>• <strong>Default Category:</strong> Set fallback for uncategorized prompts</li>
              </ul>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Member Management</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Owner:</strong> Full administrative access</li>
                <li>• <strong>Admin:</strong> Can manage members and settings</li>
                <li>• <strong>Editor:</strong> Can create and edit prompts</li>
                <li>• <strong>Viewer:</strong> Read-only access</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Common Setup Scenarios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Setup Scenarios</h2>
          
          <div className="space-y-4">
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Solo Creator</h3>
              <p className="text-gray-600 text-sm mb-2">
                Simple structure with basic categories, focus on personal organization, consider future team expansion.
              </p>
              <div className="text-xs text-gray-500">
                Best for: Individual contributors, freelancers, small business owners
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Team (2-10 people)</h3>
              <p className="text-gray-600 text-sm mb-2">
                Flat category structure, clear naming conventions, regular review meetings.
              </p>
              <div className="text-xs text-gray-500">
                Best for: Startups, small departments, project teams
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Large Organization (10+ people)</h3>
              <p className="text-gray-600 text-sm mb-2">
                Hierarchical categories, department-specific workflows, detailed permission structure.
              </p>
              <div className="text-xs text-gray-500">
                Best for: Enterprises, large teams, multiple departments
              </div>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Do&apos;s ✅</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Choose descriptive, professional names</li>
                <li>• Plan your organization structure in advance</li>
                <li>• Start simple and evolve over time</li>
                <li>• Invite team members early in the process</li>
                <li>• Set up categories before creating prompts</li>
              </ul>
            </Card>

            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Don&apos;ts ❌</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Use overly generic names</li>
                <li>• Create too many categories initially</li>
                <li>• Ignore permission settings</li>
                <li>• Skip the description field</li>
                <li>• Rush the setup process</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <Card className="p-8 bg-gray-50 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🎉 Your Workspace is Ready!
          </h3>
          <p className="text-gray-600 mb-6">
            Now that your workspace is created, here are your next steps to make it productive:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Explore the Interface</h4>
              <p className="text-sm text-gray-600">Familiarize yourself with the layout and navigation</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Create Categories</h4>
              <p className="text-sm text-gray-600">Set up your organizational structure</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Invite Your Team</h4>
              <p className="text-sm text-gray-600">Get collaborators involved early</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Build Your First Prompt</h4>
              <p className="text-sm text-gray-600">Start with something simple and useful</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help/getting-started/understanding-prompts">
                Learn About Prompts
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 