import Link from 'next/link'
import { ArrowLeft, Clock, FolderTree, Tag, Star, ArrowRight, Target, CheckCircle, Lightbulb, Users, Workflow, Database, BarChart3, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function OrganizationStrategiesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-8">
        <Link 
          href="/guides"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Badge 
            variant="outline" 
            className="text-xs font-medium"
            style={{ 
              backgroundColor: '#fefce8', 
              borderColor: '#fef9c3', 
              color: '#b45309' 
            }}
          >
            Intermediate
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            15 min read
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Organization Strategies for Prompt Libraries
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Transform your prompt collection from chaos to a well-oiled machine. Learn enterprise-grade organization strategies, 
          automation workflows, and scaling techniques that grow with your team and use cases.
        </p>

        {/* Learning objectives */}
        <div 
          className="rounded-xl p-6"
          style={{ backgroundColor: '#f0f9ff', borderColor: '#dbeafe', borderWidth: '1px' }}
        >
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 mt-0.5" style={{ color: '#1d4ed8' }} />
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#1e40af' }}>Organization Mastery You&apos;ll Gain</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: '#1e3a8a' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Scalable taxonomies and classification systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Advanced tagging and metadata strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Workflow automation and integration patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Version control and prompt evolution tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Performance metrics and optimization loops</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Team scaling and knowledge transfer systems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="space-y-16">
        {/* Section 1: Foundation Architecture */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Building Your Prompt Architecture</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              A well-organized prompt library isn&apos;t just about folders and tags—it&apos;s about creating a system that scales 
              with your team&apos;s complexity while remaining intuitive and efficient for daily use.
            </p>
          </div>

          {/* Hierarchy Levels */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">The Four-Level Hierarchy</h3>
            <p className="text-gray-700 leading-relaxed">
              Successful prompt organizations follow a consistent four-level structure that balances granularity with usability:
            </p>

            <div className="grid gap-6">
              {[
                {
                  level: "1. Domains",
                  description: "High-level business or functional areas",
                  examples: "Marketing, Engineering, Customer Success, Product",
                  icon: Database,
                  color: "#1d4ed8"
                },
                {
                  level: "2. Categories", 
                  description: "Specific use cases within domains",
                  examples: "Content Creation, Code Review, User Research, Data Analysis",
                  icon: FolderTree,
                  color: "#166534"
                },
                {
                  level: "3. Templates",
                  description: "Reusable prompt frameworks",
                  examples: "Blog Post Template, Bug Report Template, Interview Guide",
                  icon: Workflow,
                  color: "#b45309"
                },
                {
                  level: "4. Instances",
                  description: "Specific, customized prompts",
                  examples: "Q3 Product Launch Blog, Critical Bug Analysis, Senior Developer Interview",
                  icon: Tag,
                  color: "#7e22ce"
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-6"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{item.level}</h4>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      <div 
                        className="text-xs p-3 rounded-lg font-mono"
                        style={{ backgroundColor: '#f8fafc' }}
                      >
                        <strong>Examples:</strong> {item.examples}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Naming Conventions */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Strategic Naming Conventions</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
            >
              <h4 className="font-semibold text-gray-900 mb-4">The SMART Naming Framework</h4>
              
              <div className="grid gap-4">
                {[
                  {
                    principle: "Specific",
                    bad: "Marketing Prompt",
                    good: "Email-Subject-Line-AB-Test-Generator",
                    why: "Immediately clear purpose and scope"
                  },
                  {
                    principle: "Memorable", 
                    bad: "TEMP_001_v3_FINAL",
                    good: "Customer-Onboarding-Welcome-Series",
                    why: "Human-readable and searchable"
                  },
                  {
                    principle: "Action-Oriented",
                    bad: "Analysis Thing",
                    good: "Analyze-Competitor-Pricing-Strategy",
                    why: "Verb-first structure shows what it does"
                  },
                  {
                    principle: "Role-Specific",
                    bad: "Generic Content",
                    good: "PM-User-Story-Writing-Assistant",
                    why: "Target audience is immediately clear"
                  },
                  {
                    principle: "Time-Bounded",
                    bad: "Q1 Strategy",
                    good: "2024-Q1-OKR-Planning-Framework",
                    why: "Context and relevance timeframe"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: '#5b21b6' }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-2">{item.principle}</h5>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-red-600">❌ Bad:</span>
                          <div className="text-gray-600 font-mono text-xs mt-1">{item.bad}</div>
                        </div>
                        <div>
                          <span className="font-medium text-green-600">✅ Good:</span>
                          <div className="text-gray-600 font-mono text-xs mt-1">{item.good}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Why:</span>
                          <div className="text-gray-600 text-xs mt-1">{item.why}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Advanced Tagging */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Multi-Dimensional Tagging Systems</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tags are the secret weapon of prompt organization. A well-designed tagging system enables instant filtering, 
              discovery, and connection of related prompts across your entire library.
            </p>
          </div>

          {/* Tag Dimensions */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">The Six-Dimension Tagging Model</h3>
            
            <div className="grid gap-6">
              {[
                {
                  dimension: "Function",
                  description: "What the prompt does",
                  prefix: "fn:",
                  examples: ["fn:analyze", "fn:generate", "fn:summarize", "fn:translate", "fn:debug"],
                  color: "#1d4ed8"
                },
                {
                  dimension: "Domain",
                  description: "Business area or expertise",
                  prefix: "domain:",
                  examples: ["domain:marketing", "domain:engineering", "domain:legal", "domain:finance"],
                  color: "#166534"
                },
                {
                  dimension: "Audience",
                  description: "Who uses this prompt",
                  prefix: "role:",
                  examples: ["role:manager", "role:developer", "role:designer", "role:analyst"],
                  color: "#b45309"
                },
                {
                  dimension: "Complexity",
                  description: "Technical difficulty level",
                  prefix: "level:",
                  examples: ["level:beginner", "level:intermediate", "level:advanced", "level:expert"],
                  color: "#7e22ce"
                },
                {
                  dimension: "Format",
                  description: "Output type and structure",
                  prefix: "format:",
                  examples: ["format:json", "format:table", "format:email", "format:report"],
                  color: "#b91c1c"
                },
                {
                  dimension: "Status",
                  description: "Lifecycle and reliability",
                  prefix: "status:",
                  examples: ["status:draft", "status:tested", "status:approved", "status:deprecated"],
                  color: "#6b7280"
                }
              ].map((dim, index) => (
                <div 
                  key={index}
                  className="rounded-lg p-6"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: dim.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{dim.dimension}</h4>
                      <p className="text-gray-600 text-sm mb-3">{dim.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-700">PREFIX:</span>
                          <span 
                            className="ml-2 px-2 py-1 rounded text-xs font-mono"
                            style={{ backgroundColor: dim.color, color: '#ffffff' }}
                          >
                            {dim.prefix}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-700">EXAMPLES:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dim.examples.map((example, i) => (
                              <span 
                                key={i}
                                className="px-2 py-1 rounded text-xs font-mono"
                                style={{ backgroundColor: '#f3f4f6', color: dim.color }}
                              >
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Workflow Integration */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Workflow Automation & Integration</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The most effective prompt libraries aren&apos;t just storage—they&apos;re integrated into daily workflows, 
              automatically evolving and improving based on usage patterns and outcomes.
            </p>
          </div>

          {/* Integration Patterns */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Enterprise Integration Patterns</h3>
            
            <div className="grid gap-6">
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: '#f0f9ff', borderColor: '#dbeafe', borderWidth: '1px' }}
              >
                <h4 className="font-semibold mb-4" style={{ color: '#1e40af' }}>The Continuous Improvement Loop</h4>
                
                <div className="space-y-4">
                  {[
                    {
                      phase: "Usage Tracking",
                      description: "Monitor which prompts are used, when, and by whom",
                      metrics: "Frequency, success rate, user satisfaction, output quality",
                      automation: "Auto-log usage events, track performance metrics"
                    },
                    {
                      phase: "Performance Analysis",
                      description: "Analyze prompt effectiveness and identify improvement opportunities",
                      metrics: "Conversion rates, time to completion, error rates",
                      automation: "Weekly performance reports, trend analysis dashboards"
                    },
                    {
                      phase: "Optimization Signals",
                      description: "Detect prompts that need updating or replacement",
                      metrics: "Declining performance, user feedback, new use cases",
                      automation: "Automated alerts, performance thresholds, user feedback collection"
                    },
                    {
                      phase: "Iterative Improvement",
                      description: "Update prompts based on data and create new variants",
                      metrics: "A/B test results, improvement impact, adoption rates",
                      automation: "Version control, automated testing, rollback capabilities"
                    }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: '#1d4ed8' }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-2">{phase.phase}</h5>
                        <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                        <div className="grid md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">Key Metrics:</span>
                            <div className="text-gray-600 mt-1">{phase.metrics}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Automation:</span>
                            <div className="text-gray-600 mt-1">{phase.automation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Integration */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: '#f0fdf4', borderColor: '#dcfce7', borderWidth: '1px' }}
              >
                <h4 className="font-semibold mb-4" style={{ color: '#166534' }}>Strategic Tool Integration</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Development Tools</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>IDE extensions for instant prompt access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Git integration for version control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>CI/CD pipeline integration</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Business Tools</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Slack/Teams bot integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>CRM and marketing platform APIs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Analytics and reporting dashboards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Version Control */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Version Control & Evolution Tracking</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              As prompts evolve, maintaining a clear history of changes, performance impacts, and rollback capabilities 
              becomes crucial for maintaining system reliability and learning from improvements.
            </p>
          </div>

          {/* Version Control System */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Prompt Version Control Best Practices</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#fefce8', borderColor: '#fef9c3', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 mt-0.5" style={{ color: '#b45309' }} />
                <div>
                  <h4 className="font-semibold mb-4" style={{ color: '#92400e' }}>Semantic Versioning for Prompts</h4>
                  
                  <div className="space-y-4">
                    <div 
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      <div className="font-mono text-lg mb-3 text-center">
                        <span style={{ color: '#b91c1c' }}>MAJOR</span>.
                        <span style={{ color: '#b45309' }}>MINOR</span>.
                        <span style={{ color: '#15803d' }}>PATCH</span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold" style={{ color: '#b91c1c' }}>MAJOR (1.0.0)</div>
                          <div className="text-gray-600 mt-1">
                            Complete prompt rewrite, different approach, incompatible changes
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold" style={{ color: '#b45309' }}>MINOR (0.1.0)</div>
                          <div className="text-gray-600 mt-1">
                            New functionality, significant improvements, backward compatible
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold" style={{ color: '#15803d' }}>PATCH (0.0.1)</div>
                          <div className="text-gray-600 mt-1">
                            Bug fixes, small improvements, typo corrections
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div 
                        className="p-3 rounded text-sm"
                        style={{ backgroundColor: '#f8fafc' }}
                      >
                        <strong>Version Example:</strong><br/>
                        v1.2.3<br/>
                        <span className="text-gray-600">Content-Generation-Blog-Posts</span>
                      </div>
                      <div 
                        className="p-3 rounded text-sm"
                        style={{ backgroundColor: '#f8fafc' }}
                      >
                        <strong>Change Log:</strong><br/>
                        + Added tone parameters<br/>
                        * Fixed formatting issues<br/>
                        - Removed outdated examples
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Performance Analytics */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Performance Analytics & Optimization</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Data-driven prompt management transforms guesswork into systematic improvement. 
              Track the right metrics to identify high-performers and optimize your entire library.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Essential Performance Metrics</h3>
            
            <div className="grid gap-6">
              {[
                {
                  category: "Usage Metrics",
                  metrics: [
                    "Frequency of use",
                    "Unique user count", 
                    "Time spent per session",
                    "Return usage rate"
                  ],
                  insights: "Identify popular prompts and usage patterns",
                  icon: BarChart3,
                  color: "#1d4ed8"
                },
                {
                  category: "Quality Metrics",
                  metrics: [
                    "User satisfaction ratings",
                    "Output accuracy scores",
                    "Revision frequency",
                    "Success rate"
                  ],
                  insights: "Measure prompt effectiveness and quality",
                  icon: Star,
                  color: "#b45309"
                },
                {
                  category: "Efficiency Metrics",
                  metrics: [
                    "Time to first useful output",
                    "Iteration count needed",
                    "Token usage optimization",
                    "Error rate reduction"
                  ],
                  insights: "Optimize for speed and resource efficiency",
                  icon: Workflow,
                  color: "#166534"
                },
                {
                  category: "Collaboration Metrics",
                  metrics: [
                    "Sharing frequency",
                    "Cross-team adoption",
                    "Modification rate",
                    "Knowledge transfer success"
                  ],
                  insights: "Track team collaboration and knowledge spread",
                  icon: Users,
                  color: "#7e22ce"
                }
              ].map((group, index) => (
                <div 
                  key={index}
                  className="rounded-lg p-6"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    >
                      <group.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3">{group.category}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Key Metrics:</span>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            {group.metrics.map((metric, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Insights:</span>
                          <p className="text-sm text-gray-600 mt-2">{group.insights}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Team Scaling */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Scaling with Teams & Governance</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              As your organization grows, prompt management evolves from personal productivity to enterprise governance. 
              Establish frameworks that maintain quality while enabling innovation across teams.
            </p>
          </div>

          {/* Governance Framework */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Enterprise Governance Model</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
            >
              <h4 className="font-semibold text-gray-900 mb-6">Three-Tier Governance Structure</h4>
              
              <div className="space-y-6">
                {[
                  {
                    tier: "Strategic Level",
                    role: "Prompt Governance Committee",
                    responsibilities: [
                      "Define organization-wide prompt standards",
                      "Approve high-impact prompt initiatives",
                      "Set compliance and security policies",
                      "Allocate resources and budget"
                    ],
                    frequency: "Quarterly reviews",
                    stakeholders: "Executives, Department Heads, Security Teams"
                  },
                  {
                    tier: "Tactical Level",
                    role: "Prompt Engineering Teams",
                    responsibilities: [
                      "Develop and maintain prompt libraries",
                      "Conduct training and knowledge transfer",
                      "Monitor performance and optimization",
                      "Coordinate cross-team collaboration"
                    ],
                    frequency: "Weekly reviews",
                    stakeholders: "Technical Leads, Product Managers, UX Researchers"
                  },
                  {
                    tier: "Operational Level",
                    role: "End Users & Contributors",
                    responsibilities: [
                      "Use prompts in daily workflows",
                      "Provide feedback and improvement suggestions",
                      "Create and share new prompts",
                      "Follow established guidelines"
                    ],
                    frequency: "Daily usage",
                    stakeholders: "All team members, External partners"
                  }
                ].map((tier, index) => (
                  <div 
                    key={index}
                    className="rounded-lg p-5"
                    style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', borderWidth: '1px' }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: '#5b21b6' }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">{tier.tier}</h5>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Role:</span>
                            <div className="text-gray-600 mt-1">{tier.role}</div>
                            <span className="font-medium text-gray-700 mt-3 block">Frequency:</span>
                            <div className="text-gray-600 mt-1">{tier.frequency}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Key Responsibilities:</span>
                            <ul className="text-gray-600 mt-1 space-y-1">
                              {tier.responsibilities.map((resp, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <span className="font-medium text-gray-700">Stakeholders:</span>
                          <span className="text-gray-600 ml-2">{tier.stakeholders}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Security & Compliance Considerations</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-0.5" style={{ color: '#b91c1c' }} />
                <div>
                  <h4 className="font-semibold mb-4" style={{ color: '#991b1b' }}>Critical Security Framework</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Data Protection</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>PII detection and masking in prompts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Sensitive data classification systems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Automated compliance scanning</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Access Control</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Role-based prompt access permissions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Audit trails for all prompt usage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Regular access review processes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Implement Your Strategy</h2>
          
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 mt-0.5 text-yellow-500" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Your Organization Journey</h4>
                <p className="text-gray-600 mb-6">
                  You&apos;ve learned enterprise-grade organization strategies! Now master team collaboration to scale your success across your entire organization.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link 
                    href="/guides/team-collaboration"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Team Collaboration</div>
                      <div className="text-sm text-gray-500">Scale your organized system across teams</div>
                    </div>
                  </Link>
                  <Link 
                    href="/guides/prompt-engineering-101"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Review Fundamentals</div>
                      <div className="text-sm text-gray-500">Refresh your prompt engineering basics</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
} 