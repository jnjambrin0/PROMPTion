import Link from 'next/link'
import { Calendar, CheckCircle, BookOpen, Target, FolderPlus, Plus, Lightbulb, Users, ArrowRight, Settings, Folder, FileText, Star, Play, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HelpBreadcrumbs } from '@/components/help'

export default function QuickStartPage() {
  const breadcrumbItems = [
    { label: 'Help', href: '/help' },
    { label: 'Getting Started', href: '/help/getting-started' },
    { label: 'Quick Start Guide' }
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
            Quick Start Guide
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Get up and running with Promption in under 5 minutes. Your fast track to AI-powered productivity.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Last updated: January 2025
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12">
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Table of Contents</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <a href="#overview" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                1. Overview
              </a>
              <a href="#account-setup" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                2. Account Setup
              </a>
              <a href="#first-workspace" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                3. Create First Workspace
              </a>
              <a href="#first-prompt" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                4. Build First Prompt
              </a>
              <a href="#categories" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                5. Organize with Categories
              </a>
              <a href="#team" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                6. Invite Your Team
              </a>
              <a href="#templates" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                7. Explore Templates
              </a>
              <a href="#next-steps" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                8. Next Steps
              </a>
            </div>
          </div>
        </nav>

        {/* Overview Section */}
        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Promption! This quick start guide will have you creating, organizing, and collaborating on AI prompts in just a few minutes. Whether you&apos;re working solo or building with a team, follow these 6 essential steps to unlock your productivity potential.
            </p>

            {/* What You'll Accomplish */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 mt-0.5" style={{ color: '#0284c7' }} />
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: '#0c4a6e' }}>What You&apos;ll Accomplish</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: '#0369a1' }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Set up your account and first workspace</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Create and test your first AI prompt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Organize prompts with categories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Invite team members for collaboration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Discover community templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Navigate the dashboard like a pro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Investment */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 text-center" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <div className="font-semibold" style={{ color: '#15803d' }}>Total Time</div>
                <div className="text-sm mt-1" style={{ color: '#16a34a' }}>5-10 minutes</div>
              </Card>
              <Card className="p-4 text-center" style={{ backgroundColor: '#fefce8', borderColor: '#fef08a' }}>
                <div className="font-semibold" style={{ color: '#a16207' }}>Prerequisites</div>
                <div className="text-sm mt-1" style={{ color: '#ca8a04' }}>Email address</div>
              </Card>
              <Card className="p-4 text-center" style={{ backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
                <div className="font-semibold" style={{ color: '#7e22ce' }}>Outcome</div>
                <div className="text-sm mt-1" style={{ color: '#9333ea' }}>Functional workspace</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Step 1: Account Setup */}
        <section id="account-setup" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Account Setup</h2>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Create Your Account</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Option A */}
              <Card className="p-6 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Option A: Email Registration</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">1</span>
                    <span>Visit the sign-up page</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">2</span>
                    <span>Enter your work email (recommended)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">3</span>
                    <span>Create a strong password</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">4</span>
                    <span>Verify your email address</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">5</span>
                    <span>Complete profile setup</span>
                  </div>
                </div>
              </Card>

              {/* Option B */}
              <Card className="p-6 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Option B: Google Authentication</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-600">1</span>
                    <span>Click &quot;Continue with Google&quot;</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-600">2</span>
                    <span>Select your Google account</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-600">3</span>
                    <span>Grant necessary permissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-600">4</span>
                    <span>Complete profile setup</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Dashboard First Look */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Dashboard First Look</h3>
              <p className="text-gray-600">
                After setup, you&apos;ll land on your dashboard. Here&apos;s what you&apos;ll see:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Welcome Section:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Personalized greeting</li>
                    <li>• Quick start progress tracker</li>
                    <li>• Daily productivity tips</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Quick Actions:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Create your first prompt</li>
                    <li>• Set up collections</li>
                    <li>• Invite team members</li>
                    <li>• Explore templates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Create First Workspace */}
        <section id="first-workspace" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Create Your First Workspace</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Workspaces</h3>
              <p className="text-gray-600 mb-4">
                Think of workspaces as project folders for your AI prompts. They help you organize, collaborate, control access, and scale from personal use to team workflows.
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { title: "Organize", desc: "Group related prompts by team, project, or theme", color: "#f0f9ff", border: "#dbeafe", text: "#1e40af" },
                  { title: "Collaborate", desc: "Share access with specific team members", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
                  { title: "Control", desc: "Manage permissions and visibility settings", color: "#fefce8", border: "#fef08a", text: "#a16207" },
                  { title: "Scale", desc: "Expand from personal use to team workflows", color: "#faf5ff", border: "#e9d5ff", text: "#7e22ce" }
                ].map((item, index) => (
                  <Card key={index} className="p-4 text-center" style={{ backgroundColor: item.color, borderColor: item.border }}>
                    <h4 className="font-semibold mb-2" style={{ color: item.text }}>{item.title}</h4>
                    <p className="text-xs" style={{ color: item.text }}>{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Creation Process */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Workspace Creation Process</h3>
              
              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FolderPlus className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Access the Creation Form</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    From dashboard, click &quot;Create Workspace&quot; or visit <code className="bg-gray-100 px-2 py-1 rounded text-sm">/workspaces/new</code> directly. You&apos;ll need to be signed in to proceed.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/workspaces/new" className="flex items-center gap-2">
                      <FolderPlus className="h-4 w-4" />
                      Create Your First Workspace
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Essential Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Workspace Name</h5>
                    <ul className="space-y-1 text-sm text-gray-600 ml-4">
                      <li>• Keep it descriptive and professional</li>
                      <li>• Under 50 characters</li>
                      <li>• Examples: &quot;Marketing Team&quot;, &quot;Product Development&quot;, &quot;Customer Success Hub&quot;</li>
                      <li>• Avoid generic names like &quot;My Workspace&quot;</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Description (Recommended)</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Explain the workspace purpose in 1-2 sentences. Help team members understand scope and include primary use cases or goals. Maximum 200 characters.
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
            </div>
          </div>
        </section>

        {/* Step 3: Build First Prompt */}
        <section id="first-prompt" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Build Your First Prompt</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Prompts in Promption</h3>
              <p className="text-gray-600 mb-4">
                Prompts are structured templates that help you communicate effectively with AI. In Promption, they&apos;re more than simple text - they&apos;re powerful, reusable workflows.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Content Blocks", desc: "Text, headings, code, variables", icon: "🧱" },
                  { title: "Variables", desc: "Dynamic placeholders for customization", icon: "🔧" },
                  { title: "AI Configuration", desc: "Model settings and parameters", icon: "⚙️" },
                  { title: "Metadata", desc: "Tags, categories, and descriptions", icon: "📋" }
                ].map((component, index) => (
                  <Card key={index} className="p-4 border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{component.icon}</span>
                      <h4 className="font-semibold text-gray-900">{component.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{component.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Creation Walkthrough */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Prompt Creation Walkthrough</h3>

              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Start Creating</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>1. In your workspace, click &quot;New Prompt&quot;</p>
                  <p>2. Or use the &quot;+&quot; button in the sidebar</p>
                  <p>3. You&apos;ll land on the prompt creation form</p>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-4 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Clear, descriptive name</li>
                    <li>• Helps with search</li>
                    <li>• Example: &quot;Email Subject Line Generator&quot;</li>
                  </ul>
                </Card>
                <Card className="p-4 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Brief explanation of purpose</li>
                    <li>• Include use cases</li>
                    <li>• Expected outcomes</li>
                  </ul>
                </Card>
                <Card className="p-4 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Choose appropriate category</li>
                    <li>• Create new if needed</li>
                    <li>• Helps organization</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Example Prompt */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 mt-0.5" style={{ color: '#16a34a' }} />
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#15803d' }}>Example: Creating &quot;Meeting Summary Generator&quot;</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium" style={{ color: '#15803d' }}>Basic Setup:</span>
                      <div className="bg-white p-3 rounded mt-2 text-sm text-gray-700">
                        Title: Meeting Summary Generator<br/>
                        Description: Transform meeting notes into professional summaries<br/>
                        Category: Productivity
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: '#15803d' }}>Variables:</span>
                      <div className="bg-white p-3 rounded mt-2 text-sm text-gray-700">
                        • meetingDate (String): &quot;Date of the meeting&quot;<br/>
                        • attendees (String): &quot;List of meeting participants&quot;<br/>
                        • duration (String): &quot;Meeting length (e.g., 1 hour)&quot;<br/>
                        • meetingNotes (String): &quot;Raw meeting notes and discussion points&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Organize with Categories */}
        <section id="categories" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Organize with Categories</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Category System Overview</h3>
              <p className="text-gray-600 mb-4">
                Categories in Promption help you organize prompts logically. Think of them as folders, but smarter - they enable powerful search, filtering, and team organization.
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { title: "Quick Discovery", desc: "Find prompts by topic instantly", icon: "🔍", color: "#f0f9ff", border: "#dbeafe", text: "#1e40af" },
                  { title: "Team Organization", desc: "Align with department structures", icon: "👥", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
                  { title: "Permission Control", desc: "Restrict access to sensitive categories", icon: "🔒", color: "#fefce8", border: "#fef08a", text: "#a16207" },
                  { title: "Template Libraries", desc: "Create themed collections", icon: "📚", color: "#faf5ff", border: "#e9d5ff", text: "#7e22ce" }
                ].map((benefit, index) => (
                  <Card key={index} className="p-4 text-center" style={{ backgroundColor: benefit.color, borderColor: benefit.border }}>
                    <div className="text-2xl mb-2">{benefit.icon}</div>
                    <h4 className="font-semibold mb-2" style={{ color: benefit.text }}>{benefit.title}</h4>
                    <p className="text-xs" style={{ color: benefit.text }}>{benefit.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Creating Categories */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Creating Your First Categories</h3>
              
              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Folder className="h-4 w-4 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Access Category Management</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>1. Go to your workspace</p>
                  <p>2. Click on &quot;Categories&quot; tab</p>
                  <p>3. Select &quot;New Category&quot;</p>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Essential Categories for Getting Started</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">General Purpose:</h5>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• <strong>General:</strong> Catch-all for uncategorized prompts</li>
                        <li>• <strong>Templates:</strong> Reusable prompt templates</li>
                        <li>• <strong>Experiments:</strong> Testing new prompt ideas</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">By Function:</h5>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• <strong>Content:</strong> Writing and creative prompts</li>
                        <li>• <strong>Analysis:</strong> Data analysis and research</li>
                        <li>• <strong>Communication:</strong> Emails, messages, presentations</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Category Configuration</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Basic Settings:</h5>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• <strong>Name:</strong> Clear, descriptive title</li>
                        <li>• <strong>Description:</strong> Purpose and usage guidelines</li>
                        <li>• <strong>Color:</strong> Visual identifier (optional)</li>
                        <li>• <strong>Icon:</strong> Emoji or symbol for quick recognition</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Advanced Settings:</h5>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• <strong>Permissions:</strong> Who can view/edit</li>
                        <li>• <strong>Auto-tagging:</strong> Automatic tags for prompts</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Step 5: Invite Your Team */}
        <section id="team" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 5: Invite Your Team (Optional)</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Team Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Promption transforms from a personal tool to a team powerhouse when you add collaborators. Teams can share prompts, build on each other&apos;s work, and maintain consistent AI interactions across the organization.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Knowledge Sharing", desc: "Everyone benefits from best prompts", icon: "🧠" },
                  { title: "Consistency", desc: "Standardized AI interactions across team", icon: "⚖️" },
                  { title: "Quality Control", desc: "Peer review and improvement", icon: "✅" }
                ].map((benefit, index) => (
                  <Card key={index} className="p-4 text-center border-gray-200">
                    <div className="text-2xl mb-2">{benefit.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Role System */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Role-Based Permission System</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { role: "Owner", desc: "Full administrative access, manage all settings and members", color: "#fee2e2", border: "#fecaca", text: "#991b1b" },
                  { role: "Admin", desc: "Manage members and permissions, configure workspace settings", color: "#fef3c7", border: "#fde68a", text: "#92400e" },
                  { role: "Editor", desc: "Create and edit prompts, manage categories they created", color: "#f0f9ff", border: "#dbeafe", text: "#1e40af" },
                  { role: "Member", desc: "Create own prompts, view and use team prompts", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d" }
                ].map((roleItem, index) => (
                  <Card key={index} className="p-4" style={{ backgroundColor: roleItem.color, borderColor: roleItem.border }}>
                    <h4 className="font-semibold mb-2" style={{ color: roleItem.text }}>{roleItem.role}</h4>
                    <p className="text-sm" style={{ color: roleItem.text }}>{roleItem.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Invitation Process */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Invitation Process</h3>
              
              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Access Member Management</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>1. Go to your workspace</p>
                  <p>2. Click &quot;Members&quot; tab</p>
                  <p>3. Select &quot;Invite Member&quot;</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Required Information:</h5>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• <strong>Email Address:</strong> Recipient doesn&apos;t need existing account</li>
                      <li>• <strong>Role Selection:</strong> Choose from Admin, Editor, Member, or Viewer</li>
                      <li>• <strong>Personal Message:</strong> Optional custom message</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Invitation Email Contains:</h5>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Workspace name and description</li>
                      <li>• Inviter&apos;s name and email</li>
                      <li>• Role and permissions explanation</li>
                      <li>• Direct link to join</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Step 6: Explore Templates */}
        <section id="templates" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 6: Explore Templates</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding the Template System</h3>
              <p className="text-gray-600 mb-4">
                Templates in Promption are community-contributed prompts that you can use as starting points for your own work. They&apos;re tested, refined, and optimized by experienced users across various industries.
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { title: "Time Savings", desc: "Skip the trial-and-error phase", icon: "⏰" },
                  { title: "Best Practices", desc: "Learn from expert prompt engineers", icon: "🏆" },
                  { title: "Inspiration", desc: "Discover new use cases", icon: "💡" },
                  { title: "Community", desc: "Connect with other users", icon: "🌐" }
                ].map((benefit, index) => (
                  <Card key={index} className="p-4 text-center border-gray-200">
                    <div className="text-2xl mb-2">{benefit.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-xs text-gray-600">{benefit.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Template Discovery */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Template Discovery</h3>
              
              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Browse Templates</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>1. Click &quot;Templates&quot; in the main navigation</p>
                  <p>2. Or visit <code className="bg-gray-100 px-2 py-1 rounded">/templates</code> directly</p>
                  <p>3. Use the search and filter tools</p>
                </div>

                <Button variant="outline" asChild>
                  <Link href="/templates" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Explore Templates
                  </Link>
                </Button>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Template Categories</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• <strong>Content Marketing:</strong> Blog posts, social media, newsletters</li>
                    <li>• <strong>Business Operations:</strong> Reports, analysis, documentation</li>
                    <li>• <strong>Customer Success:</strong> Support responses, onboarding</li>
                    <li>• <strong>Development:</strong> Code review, documentation, debugging</li>
                    <li>• <strong>Research:</strong> Data analysis, surveys, competitive intelligence</li>
                  </ul>
                </Card>

                <Card className="p-6 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Template Quality Indicators</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• <strong>High Usage Count:</strong> Proven effectiveness</li>
                    <li>• <strong>Positive Ratings:</strong> Community approval</li>
                    <li>• <strong>Recent Updates:</strong> Active maintenance</li>
                    <li>• <strong>Detailed Documentation:</strong> Clear instructions</li>
                    <li>• <strong>Variable Setup:</strong> Well-structured customization</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Using Templates */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 mt-0.5" style={{ color: '#16a34a' }} />
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#15803d' }}>Template Implementation Process</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2" style={{ color: '#15803d' }}>1. Browse and Preview:</h5>
                      <ul className="text-sm space-y-1" style={{ color: '#16a34a' }}>
                        <li>• Search by category or keyword</li>
                        <li>• Read template description</li>
                        <li>• Preview content and structure</li>
                        <li>• Check variables and settings</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2" style={{ color: '#15803d' }}>2. Use and Customize:</h5>
                      <ul className="text-sm space-y-1" style={{ color: '#16a34a' }}>
                        <li>• Click &quot;Use Template&quot; button</li>
                        <li>• Modify content for your brand</li>
                        <li>• Adjust variables and settings</li>
                        <li>• Save to your workspace</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section id="next-steps" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Mastery</h3>
              <p className="text-gray-600 mb-4">
                Now that you&apos;re set up, familiarize yourself with the dashboard to maximize your productivity.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Key Sections</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• <strong>Recent Activity:</strong> Latest prompts and team actions</li>
                    <li>• <strong>Quick Actions:</strong> Fast access to common tasks</li>
                    <li>• <strong>Statistics:</strong> Usage and performance metrics</li>
                    <li>• <strong>Favorites:</strong> Your most-used prompts</li>
                  </ul>
                </Card>

                <Card className="p-6 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Productivity Features</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• <strong>Search:</strong> Find prompts quickly across workspaces</li>
                    <li>• <strong>Filters:</strong> Sort by category, author, or date</li>
                    <li>• <strong>Favorites:</strong> Mark frequently used prompts</li>
                    <li>• <strong>History:</strong> Track prompt usage and modifications</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Learning Progression */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Learning Progression</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6 border-gray-200" style={{ backgroundColor: '#f0f9ff', borderColor: '#dbeafe' }}>
                  <h4 className="font-semibold mb-3" style={{ color: '#1e40af' }}>Week 2 Goals</h4>
                  <ul className="text-sm space-y-1" style={{ color: '#1d4ed8' }}>
                    <li>• Set up notification preferences</li>
                    <li>• Create your first template</li>
                    <li>• Use advanced prompt variables</li>
                    <li>• Explore AI model configurations</li>
                  </ul>
                </Card>

                <Card className="p-6 border-gray-200" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <h4 className="font-semibold mb-3" style={{ color: '#15803d' }}>Week 3 Goals</h4>
                  <ul className="text-sm space-y-1" style={{ color: '#16a34a' }}>
                    <li>• Integrate with external tools</li>
                    <li>• Set up automated workflows</li>
                    <li>• Build prompt libraries by department</li>
                    <li>• Implement team review processes</li>
                  </ul>
                </Card>

                <Card className="p-6 border-gray-200" style={{ backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
                  <h4 className="font-semibold mb-3" style={{ color: '#7e22ce' }}>Month 1 Goals</h4>
                  <ul className="text-sm space-y-1" style={{ color: '#9333ea' }}>
                    <li>• Contribute to community templates</li>
                    <li>• Optimize high-usage prompts</li>
                    <li>• Train team members on best practices</li>
                    <li>• Establish prompt governance guidelines</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Learning Resources */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#fefce8', borderColor: '#fef08a', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 mt-0.5" style={{ color: '#d97706' }} />
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#92400e' }}>Continue Learning</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2" style={{ color: '#a16207' }}>Essential Reading:</h5>
                      <ul className="text-sm space-y-1" style={{ color: '#ca8a04' }}>
                        <li>• <Link href="/help/getting-started/understanding-prompts" className="hover:underline">Understanding Prompts</Link></li>
                        <li>• <Link href="/help/team-collaboration" className="hover:underline">Team Collaboration Guide</Link></li>
                        <li>• <Link href="/guides/prompt-engineering-101" className="hover:underline">Prompt Engineering Best Practices</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2" style={{ color: '#a16207' }}>Community Resources:</h5>
                      <ul className="text-sm space-y-1" style={{ color: '#ca8a04' }}>
                        <li>• Browse featured templates</li>
                        <li>• Join community discussions</li>
                        <li>• Follow prompt engineering blogs</li>
                        <li>• Participate in webinars and training</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Common Setup Issues</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Can&apos;t Create Workspace:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Verify email confirmation completed</li>
                    <li>• Check account permissions</li>
                    <li>• Clear browser cache</li>
                    <li>• Try incognito/private mode</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Team Invitations Not Working:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Confirm email addresses are correct</li>
                    <li>• Check spam/junk folders</li>
                    <li>• Verify sender permissions</li>
                    <li>• Resend invitation if needed</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Getting Help</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Self-Service Options:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• <Link href="/help" className="text-blue-600 hover:underline">Browse help documentation</Link></li>
                    <li>• Check FAQ section</li>
                    <li>• Watch tutorial videos</li>
                    <li>• Read community forums</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contact Support:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• In-app chat support</li>
                    <li>• <Link href="/help/contact" className="text-blue-600 hover:underline">Email support team</Link></li>
                    <li>• Schedule demo call</li>
                    <li>• Community Discord</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Final Call to Action */}
        <Card className="p-8 text-center" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6" style={{ color: '#16a34a' }} />
            <h3 className="text-xl font-semibold" style={{ color: '#15803d' }}>🎉 Congratulations!</h3>
          </div>
          <p className="text-#16a34a mb-6 max-w-2xl mx-auto">
            You&apos;ve successfully set up Promption and are ready to transform your AI workflow. Start with simple prompts and gradually build complexity as you become more comfortable with the platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard">
                <Play className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help/getting-started/understanding-prompts">
                <ArrowRight className="h-4 w-4 mr-2" />
                Learn About Prompts
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 