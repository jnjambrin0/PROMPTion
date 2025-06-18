import Link from 'next/link'
import { Calendar, ArrowRight, Settings, Lightbulb, Target, Users, Shield, Crown, Edit3, Eye, User, UserPlus, Activity, Mail, CheckCircle, AlertCircle, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HelpBreadcrumbs } from '@/components/help'

export default function TeamCollaborationPage() {
  const breadcrumbItems = [
    { label: 'Help', href: '/help' },
    { label: 'Team Collaboration' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <HelpBreadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-#6b7280" />
            <span className="text-sm font-medium text-#6b7280">Team Collaboration</span>
          </div>
          
          <h1 className="text-4xl font-bold text-#111827 mb-4 leading-tight font-serif">
            Team Collaboration
          </h1>
          
          <p className="text-xl text-#6b7280 leading-relaxed mb-6 font-serif">
            Master the art of working together in Promption. Learn how to build high-performing teams, manage permissions, and collaborate effectively on prompts.
          </p>

          <div className="flex items-center gap-4 text-sm text-#6b7280">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Last updated: December 2024</span>
            </div>
            <div className="flex items-center gap-1">
              <span>•</span>
              <span>15 min read</span>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        <Card className="mb-12 p-6" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
          <h2 className="text-lg font-semibold text-#111827 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <a href="#understanding" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Understanding Team Collaboration
            </a>
            <a href="#roles-permissions" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Workspace Roles & Permissions
            </a>
            <a href="#inviting-members" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Inviting Team Members
            </a>
            <a href="#managing-members" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Managing Members
            </a>
            <a href="#collaboration-features" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Collaboration Features
            </a>
            <a href="#best-practices" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Best Practices
            </a>
            <a href="#common-scenarios" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Common Scenarios
            </a>
            <a href="#troubleshooting" className="flex items-center gap-2 text-#6b7280 hover:text-#111827 transition-colors py-1">
              <span className="w-1 h-1 bg-#6b7280 rounded-full"></span>
              Troubleshooting
            </a>
          </div>
        </Card>

        {/* Content */}
        <article className="space-y-16 font-serif">
          {/* Understanding Team Collaboration */}
          <section id="understanding" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-#111827">Understanding Team Collaboration</h2>
              <p className="text-lg text-#374151 leading-relaxed">
                Team collaboration in Promption is built around <strong>workspaces</strong> - shared environments where multiple team members can work together on prompts, templates, and AI workflows.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-#111827">What is Team Collaboration in Promption?</h3>
              <p className="text-#374151 leading-relaxed">
                Each workspace functions as a collaborative hub with unified prompt libraries, role-based access control, real-time collaboration capabilities, activity tracking, and shared organization systems.
              </p>
              
              <Card className="p-6" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 mt-0.5" style={{ color: '#0284c7' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#0c4a6e' }}>Key Collaboration Benefits</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: '#0369a1' }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Shared knowledge base eliminates duplicate work</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Consistent branding across all AI interactions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Version control for collaborative refinement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Scalable workflows that grow with teams</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Peer review improves prompt quality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Collective intelligence for better outputs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-#111827">Core Collaboration Components</h3>
              <div className="grid gap-4">
                {[
                  {
                    icon: Users,
                    title: "Workspace Environment",
                    description: "Shared space for all team activities and resources"
                  },
                  {
                    icon: UserPlus,
                    title: "Member Management", 
                    description: "Adding, removing, and managing team access with ease"
                  },
                  {
                    icon: Shield,
                    title: "Permission System",
                    description: "Five-tier role hierarchy ensuring security and proper access"
                  },
                  {
                    icon: Activity,
                    title: "Activity Tracking",
                    description: "Complete audit trail of all team actions and changes"
                  },
                  {
                    icon: Settings,
                    title: "Notification System",
                    description: "Stay informed about important team activities and updates"
                  }
                ].map((component, index) => (
                  <Card key={index} className="p-4 border border-#e5e7eb">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
                        <component.icon className="h-5 w-5 text-#6b7280" />
                      </div>
                      <div>
                        <h4 className="font-medium text-#111827 mb-1">{component.title}</h4>
                        <p className="text-sm text-#6b7280">{component.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Workspace Roles & Permissions */}
          <section id="roles-permissions" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-#111827">Workspace Roles & Permissions</h2>
              <p className="text-lg text-#374151 leading-relaxed">
                Promption uses a comprehensive five-tier role system designed for teams of all sizes, from small startups to large enterprises.
              </p>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-#111827">The Five-Tier Role Hierarchy</h3>
              
              {/* Owner Role */}
              <Card className="p-6" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                    <Crown className="h-6 w-6" style={{ color: '#d97706' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: '#92400e' }}>👑 Owner</h4>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#fbbf24', color: '#92400e' }}>Ultimate Authority</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#a16207' }}>
                      Workspace creator with complete control. Only one owner per workspace, responsible for strategic decisions, billing, and workspace-wide settings.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-xs" style={{ color: '#a16207' }}>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Manage workspace settings & delete workspace</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Invite/remove members & change any roles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Full prompt and category management</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Access analytics & export data</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Admin Role */}
              <Card className="p-6" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
                    <Shield className="h-6 w-6" style={{ color: '#2563eb' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: '#1e40af' }}>🛡️ Admin</h4>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#60a5fa', color: '#1e40af' }}>Team Leaders</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#1d4ed8' }}>
                      Trusted team leaders and managers. Perfect for team leads, project managers, and senior engineers. Cannot remove other admins or promote to owner.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-xs" style={{ color: '#1d4ed8' }}>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Edit workspace settings (no deletion)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Manage members (except other admins)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Full content management access</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Analytics and data export</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Editor Role */}
              <Card className="p-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#dcfce7' }}>
                    <Edit3 className="h-6 w-6" style={{ color: '#16a34a' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: '#15803d' }}>✏️ Editor</h4>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#4ade80', color: '#15803d' }}>Content Creators</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#166534' }}>
                      Content creators and active contributors. Ideal for prompt engineers and frequent collaborators. Full content control without administrative overhead.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-xs" style={{ color: '#166534' }}>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Create and edit all prompts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Create categories (limited deletion)</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="h-3 w-3 rounded-full border border-current"></span>
                        <span>No member or workspace management</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="h-3 w-3 rounded-full border border-current"></span>
                        <span>No analytics or data export</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Member Role */}
              <Card className="p-6" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
                    <User className="h-6 w-6" style={{ color: '#6b7280' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: '#374151' }}>👥 Member</h4>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#9ca3af', color: '#374151' }}>Contributors</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#4b5563' }}>
                      Standard team contributors and regular members. Can create content but cannot modify others&apos; work. Perfect for most team members.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-xs" style={{ color: '#4b5563' }}>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Create new prompts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Edit own prompts only</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="h-3 w-3 rounded-full border border-current"></span>
                        <span>Cannot edit others&apos; content</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="h-3 w-3 rounded-full border border-current"></span>
                        <span>No administrative functions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Viewer Role */}
              <Card className="p-6" style={{ backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#f3e8ff' }}>
                    <Eye className="h-6 w-6" style={{ color: '#7c3aed' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: '#6b21a8' }}>👁️ Viewer</h4>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#a855f7', color: '#6b21a8' }}>Read-Only</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#7e22ce' }}>
                      Read-only access for observers. Perfect for stakeholders, clients, temporary access, or team members in onboarding. Complete security with no modification capabilities.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-xs" style={{ color: '#7e22ce' }}>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>View all public prompts and content</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="h-3 w-3 rounded-full border border-current"></span>
                        <span>Cannot create, edit, or delete anything</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="h-3 w-3 rounded-full border border-current"></span>
                        <span>No management functions</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="h-3 w-3 rounded-full border border-current"></span>
                        <span>No administrative access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Permission Matrix */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-#111827">Permission System Deep Dive</h3>
              
              <Card className="p-6" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                <h4 className="font-semibold text-#111827 mb-4">Permission Matrix Overview</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-#e5e7eb">
                        <th className="text-left p-2 font-medium text-#374151">Action</th>
                        <th className="text-center p-2 font-medium text-#374151">Owner</th>
                        <th className="text-center p-2 font-medium text-#374151">Admin</th>
                        <th className="text-center p-2 font-medium text-#374151">Editor</th>
                        <th className="text-center p-2 font-medium text-#374151">Member</th>
                        <th className="text-center p-2 font-medium text-#374151">Viewer</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {[
                        ['Invite Members', '✅', '✅', '❌', '❌', '❌'],
                        ['Remove Members', '✅', '✅*', '❌', '❌', '❌'],
                        ['Change Roles', '✅', '✅*', '❌', '❌', '❌'],
                        ['Create Prompts', '✅', '✅', '✅', '✅', '❌'],
                        ['Edit All Prompts', '✅', '✅', '✅', '❌', '❌'],
                        ['Delete Prompts', '✅', '✅', '❌', '❌', '❌'],
                        ['Manage Categories', '✅', '✅', '✅', '❌', '❌'],
                        ['Workspace Settings', '✅', '✅', '❌', '❌', '❌'],
                        ['View Analytics', '✅', '✅', '❌', '❌', '❌']
                      ].map(([action, ...permissions], index) => (
                        <tr key={index} className="border-b border-#f3f4f6">
                          <td className="p-2 text-#374151">{action}</td>
                          {permissions.map((permission, pIndex) => (
                            <td key={pIndex} className="text-center p-2">
                              <span className={permission === '✅' ? 'text-#16a34a' : permission === '❌' ? 'text-#dc2626' : 'text-#d97706'}>
                                {permission}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-#6b7280 mt-3">
                  * Admins cannot affect other Admins or Owner roles
                </p>
              </Card>
            </div>
          </section>

          {/* Inviting Team Members */}
          <section id="inviting-members" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-#111827">Inviting Team Members</h2>
              <p className="text-lg text-#374151 leading-relaxed">
                Adding team members to your workspace is simple and secure. Learn the complete invitation process, email system, and advanced features.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-#111827">The Invitation Process</h3>
              
              <div className="grid gap-6">
                <Card className="p-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#16a34a' }}>1</div>
                    <div>
                      <h4 className="font-semibold text-#111827 mb-2">Access the Invite Function</h4>
                      <p className="text-sm text-#374151 mb-2">Navigate to your workspace, go to the Members tab, and click &quot;Invite Member&quot; (visible to Owners and Admins only).</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#2563eb' }}>2</div>
                    <div>
                      <h4 className="font-semibold text-#111827 mb-2">Fill Invitation Details</h4>
                      <div className="space-y-2 text-sm text-#374151">
                        <p><strong>Required:</strong> Email address (recipient doesn&apos;t need existing Promption account)</p>
                        <p><strong>Role Selection:</strong> Choose from Admin, Editor, Member, or Viewer</p>
                        <p><strong>Personal Message:</strong> Optional custom message to include</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#d97706' }}>3</div>
                    <div>
                      <h4 className="font-semibold text-#111827 mb-2">Send and Track</h4>
                      <p className="text-sm text-#374151">Invitation sent automatically via email with 7-day expiration for security. Track status: Pending → Accepted/Rejected/Expired.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-6" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-#6b7280" />
                <div>
                  <h4 className="font-semibold text-#111827 mb-3">What Recipients Receive</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-#374151">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                      <span>Workspace name and description</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                      <span>Inviter&apos;s name and email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                      <span>Role explanation and permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                      <span>Personal message (if included)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                      <span>One-click acceptance link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                      <span>7-day expiration warning</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Managing Members */}
          <section id="managing-members" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-#111827">Managing Members</h2>
              <p className="text-lg text-#374151 leading-relaxed">
                Comprehensive member management tools for role changes, activity monitoring, and team administration.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-#111827">Member Overview Interface</h3>
              
              <Card className="p-6" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                <h4 className="font-semibold text-#111827 mb-4">Information Displayed</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-#374151">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-#6b7280" />
                      <span><strong>Avatar and Name:</strong> Visual identification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-#6b7280" />
                      <span><strong>Email Address:</strong> Contact information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-#6b7280" />
                      <span><strong>Role Badge:</strong> Color-coded indicators</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-#6b7280" />
                      <span><strong>Join Date:</strong> When they joined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-#6b7280" />
                      <span><strong>Last Active:</strong> Recent activity timestamp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-#6b7280" />
                      <span><strong>Quick Actions:</strong> Management dropdown</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: '#dc2626' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#991b1b' }}>Member Removal Security</h4>
                    <div className="space-y-2 text-sm" style={{ color: '#7f1d1d' }}>
                      <p>• <strong>Cannot remove Owner</strong> (must transfer ownership first)</p>
                      <p>• <strong>Admins cannot remove other Admins</strong> (Owner-only action)</p>
                      <p>• <strong>Cannot remove yourself</strong> (prevents accidental lockouts)</p>
                      <p>• <strong>Immediate access revocation</strong> upon removal</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-#111827">Best Practices</h2>
              <p className="text-lg text-#374151 leading-relaxed">
                Proven strategies for team structure, security, and collaboration workflow optimization.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-#111827">Team Structure Guidelines</h3>
              
              <div className="grid gap-6">
                <Card className="p-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <h4 className="font-semibold text-#111827 mb-3 flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Small Teams</span>
                    2-5 people
                  </h4>
                  <div className="text-sm text-#374151 space-y-1">
                    <p>• 1 Owner (founding member)</p>
                    <p>• 1-2 Editors (main contributors)</p>
                    <p>• 1-2 Members (occasional contributors)</p>
                    <p>• 0 Admins (not needed yet)</p>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                  <h4 className="font-semibold text-#111827 mb-3 flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>Medium Teams</span>
                    6-15 people
                  </h4>
                  <div className="text-sm text-#374151 space-y-1">
                    <p>• 1 Owner (business owner)</p>
                    <p>• 1-2 Admins (team leads)</p>
                    <p>• 3-5 Editors (active creators)</p>
                    <p>• 5-7 Members (regular contributors)</p>
                    <p>• 0-2 Viewers (stakeholders)</p>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
                  <h4 className="font-semibold text-#111827 mb-3 flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>Large Teams</span>
                    16+ people
                  </h4>
                  <div className="text-sm text-#374151 space-y-1">
                    <p>• 1 Owner (executive sponsor)</p>
                    <p>• 2-3 Admins (department heads)</p>
                    <p>• 6-8 Editors (prompt engineers)</p>
                    <p>• 8-12 Members (content creators)</p>
                    <p>• 3-5 Viewers (stakeholders, clients)</p>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-6" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 mt-0.5" style={{ color: '#d97706' }} />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#92400e' }}>Security Best Practices</h4>
                  <div className="space-y-2 text-sm" style={{ color: '#a16207' }}>
                    <p><strong>Principle of Least Privilege:</strong> Start with minimum access, promote gradually</p>
                    <p><strong>Regular Reviews:</strong> Monthly access audits for team changes</p>
                    <p><strong>Immediate Revocation:</strong> Remove access when members leave</p>
                    <p><strong>Role Hygiene:</strong> Quarterly review of role appropriateness</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Common Scenarios */}
          <section id="common-scenarios" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-#111827">Common Scenarios</h2>
              <p className="text-lg text-#374151 leading-relaxed">
                Real-world examples of team collaboration setups for different organizational needs.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 mt-0.5" style={{ color: '#0284c7' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#0c4a6e' }}>Scenario: Marketing Team Onboarding</h4>
                    <p className="text-sm mb-3" style={{ color: '#0369a1' }}>
                      Adding 8 marketing team members to collaborate on content prompts across blog, social media, and email campaigns.
                    </p>
                    <div className="space-y-2 text-sm" style={{ color: '#0369a1' }}>
                      <p><strong>Structure:</strong> 1 Admin (Director), 2 Editors (Senior), 4 Members (Writers), 1 Viewer (Intern)</p>
                      <p><strong>Process:</strong> CSV import → Personalized messages → 2-week onboarding → Role evaluation</p>
                      <p><strong>Categories:</strong> Blog Content, Social Media, Email Marketing with sub-templates</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 mt-0.5" style={{ color: '#16a34a' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#15803d' }}>Scenario: Remote Development Team</h4>
                    <p className="text-sm mb-3" style={{ color: '#166534' }}>
                      12-person remote software team across 3 time zones collaborating on technical documentation.
                    </p>
                    <div className="space-y-2 text-sm" style={{ color: '#166534' }}>
                      <p><strong>Challenge:</strong> Time zones, varying technical levels, multiple specializations</p>
                      <p><strong>Solution:</strong> Asynchronous collaboration, skill-based roles, detailed change logs</p>
                      <p><strong>Structure:</strong> 1 Tech Lead (Admin), 3 Senior Devs (Editors), 6 Devs (Members), 2 Junior (Viewers)</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{ backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 mt-0.5" style={{ color: '#7c3aed' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#6b21a8' }}>Scenario: Client Collaboration</h4>
                    <p className="text-sm mb-3" style={{ color: '#7e22ce' }}>
                      Consulting agency collaborating with client team on AI prompt development with controlled access.
                    </p>
                    <div className="space-y-2 text-sm" style={{ color: '#7e22ce' }}>
                      <p><strong>Strategy:</strong> Dual workspace approach (internal + client collaboration)</p>
                      <p><strong>Client Roles:</strong> 1 Lead (Editor), 2 SMEs (Members), 3 Stakeholders (Viewers)</p>
                      <p><strong>Protocols:</strong> Weekly syncs, staged rollouts, clear IP boundaries</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-#111827">Troubleshooting</h2>
              <p className="text-lg text-#374151 leading-relaxed">
                Solutions for common collaboration issues, permission problems, and team management challenges.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: '#dc2626' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#991b1b' }}>Problem: Invitations Not Received</h4>
                    <div className="space-y-2 text-sm" style={{ color: '#7f1d1d' }}>
                      <p><strong>Check:</strong> Spam/junk folder, email spelling, corporate filters</p>
                      <p><strong>Solution:</strong> Add noreply@promption.dev to contacts, resend after 1 hour</p>
                      <p><strong>Expiry:</strong> 7-day automatic cleanup, resend with new window if needed</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: '#d97706' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#92400e' }}>Problem: Permission Denied Errors</h4>
                    <div className="space-y-2 text-sm" style={{ color: '#a16207' }}>
                      <p><strong>Diagnostic:</strong> Verify current role, check required permissions for action</p>
                      <p><strong>Common:</strong> Member trying to edit others&apos; prompts (requires Editor+)</p>
                      <p><strong>Resolution:</strong> Update role or find alternative approach</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: '#0284c7' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#0c4a6e' }}>Problem: Workspace Performance Issues</h4>
                    <div className="space-y-2 text-sm" style={{ color: '#0369a1' }}>
                      <p><strong>Causes:</strong> Large member count (50+), extensive prompt library (500+)</p>
                      <p><strong>Solutions:</strong> Archive old prompts, remove inactive members, simplify categories</p>
                      <p><strong>Optimization:</strong> Use pagination, optimize browser cache settings</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Quick Reference */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-#111827">Quick Reference</h2>
            
            <Card className="p-6" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
              <h4 className="font-semibold text-#111827 mb-4">Common Actions Checklist</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-#374151">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                  <span>Inviting Members: Admin+ required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                  <span>Role Changes: Admin+ (with restrictions)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                  <span>Prompt Collaboration: Any role (if added)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                  <span>Category Management: Editor+ required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                  <span>Member Removal: Admin+ required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-#16a34a flex-shrink-0" />
                  <span>Workspace Deletion: Owner only</span>
                </div>
              </div>
            </Card>
          </section>

          {/* Final Call to Action */}
          <Card className="p-8 text-center" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-6 w-6" style={{ color: '#0284c7' }} />
              <h3 className="text-xl font-semibold" style={{ color: '#0c4a6e' }}>Ready to Collaborate?</h3>
            </div>
            <p className="text-#0369a1 mb-6 max-w-2xl mx-auto">
              Start building your team workspace today. Invite members, set up roles, and begin collaborating on powerful AI prompts that drive results.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/help/getting-started/first-workspace">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Create Your First Workspace
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Explore More Help Topics
                </Link>
              </Button>
            </div>
          </Card>
        </article>
      </div>
    </div>
  )
} 