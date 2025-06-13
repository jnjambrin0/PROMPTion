import Link from 'next/link'
import { ArrowLeft, Clock, Users, Shield, GitBranch, MessageSquare, ArrowRight, Target, CheckCircle, AlertTriangle, Star, Zap, Settings, Lock, TrendingUp, Beaker, GitMerge, Building, BookCopy, LineChart, CircleDollarSign, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function TeamCollaborationPage() {
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
            14 min read
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Team Collaboration & Knowledge Sharing
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Scale prompt engineering expertise across your entire organization. Build collaborative workflows, 
          establish governance frameworks, and create systems that turn individual knowledge into collective intelligence.
        </p>

        {/* Learning objectives */}
        <div 
          className="rounded-xl p-6"
          style={{ backgroundColor: '#f0f9ff', borderColor: '#dbeafe', borderWidth: '1px' }}
        >
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 mt-0.5" style={{ color: '#1d4ed8' }} />
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#1e40af' }}>Collaboration Capabilities You'll Enable</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: '#1e3a8a' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Structured enterprise collaboration workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Knowledge sharing and training systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Quality control and peer review frameworks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Cross-functional integration strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Security, compliance, and governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>ROI measurement and continuous improvement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="space-y-16">
        {/* Section 1: Team Workflows */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Collaborative Workflows</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Effective team collaboration around prompts requires structured workflows that balance creativity with consistency, 
              speed with quality, and individual contribution with collective ownership.
            </p>
          </div>

          {/* Workflow Models */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Enterprise Workflow Models</h3>
            
            <div className="grid gap-6">
              {[
                {
                  model: "Centralized Hub",
                  description: "Expert team manages all prompts",
                  bestFor: "Large organizations, regulated industries",
                  pros: ["High quality control", "Consistent standards", "Expert optimization"],
                  cons: ["Slower iteration", "Bottleneck risk", "Less user input"],
                  icon: Shield,
                  color: "#dc2626"
                },
                {
                  model: "Distributed Network",
                  description: "Teams manage their own prompts with guidelines",
                  bestFor: "Agile organizations, diverse use cases",
                  pros: ["Fast iteration", "Domain expertise", "High adoption"],
                  cons: ["Quality variance", "Duplication risk", "Coordination challenges"],
                  icon: GitBranch,
                  color: "#16a34a"
                },
                {
                  model: "Hybrid Governance",
                  description: "Central standards with team autonomy",
                  bestFor: "Growing companies, mixed complexity",
                  pros: ["Balanced approach", "Scalable structure", "Flexible adaptation"],
                  cons: ["Complex setup", "Clear role definition needed", "Ongoing coordination"],
                  icon: Settings,
                  color: "#f59e0b"
                },
                {
                  model: "Federated Model (Hub-and-Spoke)",
                  description: "Teams work in isolated sandboxes, promoting rapid experimentation. A central team reviews and promotes the best prompts.",
                  icon: Beaker,
                  color: "#b91c1c",
                  pros: [
                    "Maximum autonomy and speed.",
                    "Fosters creativity and rapid iteration.",
                    "Low administrative overhead."
                  ],
                  cons: [
                    "High risk of duplicated effort.",
                    "Inconsistent quality and standards.",
                    "Difficult to share best practices."
                  ]
                },
                {
                  model: "Federated Model (Hub-and-Spoke)",
                  description: "Each team manages their own prompt lifecycle but publishes to a central, shared repository for cross-pollination.",
                  icon: GitMerge,
                  color: "#166534",
                  pros: [
                    "Balances autonomy with centralization.",
                    "Encourages knowledge sharing.",
                    "Improves quality through shared standards."
                  ],
                  cons: [
                    "Requires clear governance model.",
                    "Potential for process bottlenecks.",
                    "More complex to manage."
                  ]
                },
                {
                  model: "Centralized Model (Top-Down)",
                  description: "A single, dedicated Prompt Engineering team creates, validates, and distributes all prompts for the organization.",
                  icon: Building,
                  color: "#b45309",
                  pros: [
                    "Ensures highest quality and consistency.",
                    "Maximum security and compliance.",
                    "Efficient use of expert resources."
                  ],
                  cons: [
                    "Can become a bottleneck.",
                    "Slower to respond to team needs.",
                    "May stifle team-level innovation."
                  ]
                }
              ].map((model, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-6"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: model.color }}
                    >
                      <model.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{model.model}</h4>
                      <p className="text-gray-600 text-sm mb-3">{model.description}</p>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Best for:</span>
                          <div className="text-gray-600 mt-1">{model.bestFor}</div>
                        </div>
                        <div>
                          <span className="font-medium text-green-600">Pros:</span>
                          <div className="p-4 rounded-lg bg-white border border-gray-200">
                            <ul className="space-y-1.5 text-sm">
                              {model.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{backgroundColor: '#16a34a' }}></div>
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-orange-600">Cons:</span>
                          <div className="p-4 rounded-lg bg-white border border-gray-200">
                            <ul className="space-y-1.5 text-sm">
                              {model.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{backgroundColor: '#fb923c' }}></div>
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
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

        {/* Section 2: Knowledge Sharing */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Knowledge Sharing Systems</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Transform individual expertise into organizational capability through systematic knowledge sharing, 
              training programs, and community building initiatives.
            </p>
          </div>

          {/* Sharing Strategies */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Multi-Channel Knowledge Transfer</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f0fdf4', borderColor: '#dcfce7', borderWidth: '1px' }}
            >
              <h4 className="font-semibold mb-4" style={{ color: '#15803d' }}>Building a Knowledge-Sharing Culture</h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Communication Channels</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16a34a' }}></div>
                      <span>Dedicated #prompt-engineering Slack/Teams channel.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16a34a' }}></div>
                      <span>Weekly "Prompt Showcase" meetings.</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Documentation Practices</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16a34a' }}></div>
                      <span>Mandatory descriptions and usage examples for all shared prompts.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16a34a' }}></div>
                      <span>Maintain a "Prompt Cookbook" with best practices.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Quality Control */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Quality Control & Peer Review</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Maintain high standards across your prompt library through systematic review processes, 
              quality metrics, and continuous improvement loops.
            </p>
          </div>

          {/* Review Process */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Multi-Stage Review Framework</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
            >
              <h4 className="font-semibold text-gray-900 mb-6">Four-Stage Quality Gate</h4>
              
              <div className="space-y-6">
                {[
                  {
                    stage: "Author Review",
                    owner: "Prompt Creator",
                    checks: ["Technical accuracy", "Clear documentation", "Example testing", "Style compliance"],
                    criteria: "Self-validation against quality checklist",
                    duration: "15 minutes"
                  },
                  {
                    stage: "Peer Review",
                    owner: "Team Member",
                    checks: ["Use case relevance", "Alternative approaches", "Edge case coverage", "Clarity"],
                    criteria: "Cross-functional perspective validation",
                    duration: "30 minutes"
                  },
                  {
                    stage: "Expert Review",
                    owner: "Domain Specialist",
                    checks: ["Advanced optimization", "Security implications", "Integration impact", "Standards alignment"],
                    criteria: "Technical excellence and strategic fit",
                    duration: "45 minutes"
                  },
                  {
                    stage: "Usage Validation",
                    owner: "End Users",
                    checks: ["Real-world performance", "User experience", "Training needs", "Adoption barriers"],
                    criteria: "Practical effectiveness measurement",
                    duration: "1-2 weeks"
                  }
                ].map((stage, index) => (
                  <div 
                    key={index}
                    className="rounded-lg p-5"
                    style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', borderWidth: '1px' }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: '#6366f1' }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">{stage.stage}</h5>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Owner:</span>
                            <div className="text-gray-600 mt-1">{stage.owner}</div>
                            <span className="font-medium text-gray-700 mt-2 block">Duration:</span>
                            <div className="text-gray-600 mt-1">{stage.duration}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Key Checks:</span>
                            <ul className="text-gray-600 mt-1 space-y-1">
                              {stage.checks.map((check, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  {check}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Criteria:</span>
                            <div className="text-gray-600 mt-1">{stage.criteria}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Security & Compliance */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Security & Compliance Framework</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Protect sensitive information, ensure regulatory compliance, and maintain security standards 
              while enabling collaborative prompt development and sharing.
            </p>
          </div>

          {/* Security Measures */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Multi-Layer Security Strategy</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-0.5" style={{ color: '#b91c1c' }} />
                <div>
                  <h4 className="font-semibold mb-4" style={{ color: '#991b1b' }}>Security & Compliance</h4>
                  <p className="text-sm mb-6" style={{ color: '#7f1d1d' }}>
                    Collaboration increases risk. A robust security model is non-negotiable.
                  </p>
                  
                  <div className="grid gap-6">
                    {[
                      {
                        tier: "Prompt Security",
                        description: "Scan prompts for sensitive data or secrets before saving.",
                        icon: Beaker,
                        color: "#dc2626"
                      },
                      {
                        tier: "Usage Auditing",
                        description: "Log all prompt executions and link them to users.",
                        icon: BookCopy,
                        color: "#dc2626"
                      },
                      {
                        tier: "Adoption Metrics",
                        description: "Track user engagement and the spread of prompt usage across teams.",
                        icon: Users,
                        color: "#166534"
                      },
                      {
                        tier: "Cost Analysis",
                        description: "Monitor and optimize token usage and associated API costs.",
                        icon: CircleDollarSign,
                        color: "#b45309"
                      }
                    ].map((tier, index) => (
                      <div 
                        key={index}
                        className="rounded-lg p-4"
                        style={{ backgroundColor: '#ffffff' }}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: tier.color }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-3">{tier.tier}</h5>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Description:</span>
                                <div className="text-gray-600 mt-1">{tier.description}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: ROI Measurement */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">ROI Measurement & Success Metrics</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Quantify the business impact of collaborative prompt engineering through comprehensive metrics, 
              cost-benefit analysis, and continuous improvement measurement.
            </p>
          </div>

          {/* ROI Framework */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Comprehensive ROI Framework</h3>
            
            <div className="grid gap-6">
              {[
                {
                  framework: "ROI Framework",
                  description: "Justify and measure the business impact of prompt engineering efforts.",
                  icon: LineChart,
                  color: "#1d4ed8"
                },
                {
                  framework: "Adoption Metrics",
                  description: "Track user engagement and the spread of prompt usage across teams.",
                  icon: Users,
                  color: "#166534"
                },
                {
                  framework: "Cost Analysis",
                  description: "Monitor and optimize token usage and associated API costs.",
                  icon: CircleDollarSign,
                  color: "#b45309"
                }
              ].map((fw, index) => (
                <div 
                  key={index}
                  className="rounded-lg p-6"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: fw.color }}
                    >
                      <fw.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3">{fw.framework}</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <div className="text-gray-600 mt-1">{fw.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Implementation Roadmap */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Implementation Roadmap</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              A practical 90-day plan to transform your organization's prompt engineering capabilities 
              from individual expertise to enterprise-scale collaborative advantage.
            </p>
          </div>

          {/* 90-Day Plan */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">90-Day Transformation Plan</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f0f9ff', borderColor: '#dbeafe', borderWidth: '1px' }}
            >
              <h4 className="font-semibold mb-6" style={{ color: '#1e40af' }}>Your First 90-Day Implementation Plan</h4>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Foundation",
                    focus: "Establish core infrastructure and initial team",
                    deliverables: ["Team formation", "Tool setup", "Initial training", "First prompt library"],
                    success: "5-10 high-quality prompts, basic workflows established"
                  },
                  {
                    title: "Scaling",
                    focus: "Expand across teams and establish governance",
                    deliverables: ["Cross-team rollout", "Quality processes", "Advanced training", "Integration setup"],
                    success: "50+ prompts, multiple teams actively contributing"
                  },
                  {
                    title: "Optimization",
                    focus: "Measure impact and refine processes",
                    deliverables: ["ROI measurement", "Process optimization", "Advanced features", "Future roadmap"],
                    success: "Measurable business impact, sustainable processes"
                  }
                ].map((phase, index) => (
                  <div 
                    key={index}
                    className="rounded-lg p-5"
                    style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderWidth: '1px' }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: '#1d4ed8' }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">{phase.title}</h5>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Focus:</span>
                            <div className="text-gray-600 mt-1">{phase.focus}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Key Deliverables:</span>
                            <div className="text-gray-600 mt-1">{phase.deliverables.join(", ")}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Success Criteria:</span>
                            <div className="text-gray-600 mt-1">{phase.success}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Start Your Transformation</h2>
          
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 mt-0.5 text-yellow-500" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Complete Your Journey</h4>
                <p className="text-gray-600 mb-6">
                  You've mastered the complete prompt engineering ecosystem! From individual skills to enterprise collaboration, 
                  you're ready to transform how your organization leverages AI.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link 
                    href="/guides/prompt-engineering-101"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Review Fundamentals</div>
                      <div className="text-sm text-gray-500">Refresh your foundational knowledge</div>
                    </div>
                  </Link>
                  <Link 
                    href="/guides/organization-strategies"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Organization Strategies</div>
                      <div className="text-sm text-gray-500">Implement systematic organization</div>
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