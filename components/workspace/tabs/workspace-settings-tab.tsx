'use client'

import { useState } from 'react'
import { Settings, Globe, Lock, Bell, Save, AlertTriangle, Users, BarChart3, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ============================================================================
// TYPES
// ============================================================================

interface WorkspaceData {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  plan: string
  createdAt: Date
  ownerId: string
  _count: {
    prompts: number
    members: number
    categories: number
  }
}

interface CategoryData {
  id: string
  name: string
  color: string | null
  icon: string | null
}

interface MemberData {
  id: string
  role: string
  joinedAt: Date
  user: {
    id: string
    username: string | null
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

interface PromptData {
  id: string
  title: string
  slug: string
  description: string | null
  isPublic: boolean
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
}

interface WorkspaceStats {
  totalPrompts: number
  totalMembers: number
  totalCategories: number
  publicPrompts: number
}

interface WorkspaceSettingsTabProps {
  workspaceSlug: string
  workspaceData: {
    workspace: WorkspaceData
    categories: CategoryData[]
    members: MemberData[]
    prompts?: PromptData[]
    stats?: WorkspaceStats
  }
}

// Server Components for better performance
function SettingsSection({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}

function SettingRow({ 
  icon: Icon, 
  label, 
  description, 
  badge, 
  action 
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  description: string
  badge?: string
  action: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0 last:pb-0">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <Label className="text-sm font-medium">{label}</Label>
          {badge && (
            <Badge variant="outline" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}

function DangerAction({ 
  title, 
  description, 
  buttonText, 
  variant = "outline" 
}: {
  title: string
  description: string
  buttonText: string
  variant?: "outline" | "destructive"
}) {
  return (
    <div className="border border-border rounded-lg p-3 bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
        <Button variant={variant} size="sm" className="h-7">
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default function WorkspaceSettingsTab({ workspaceSlug, workspaceData }: WorkspaceSettingsTabProps) {
  const { workspace } = workspaceData
  
  const [workspaceName, setWorkspaceName] = useState(workspace.name || '')
  const [workspaceDescription, setWorkspaceDescription] = useState(workspace.description || '')
  const [isPublic, setIsPublic] = useState(false)
  const [allowComments, setAllowComments] = useState(true)
  const [allowTemplates, setAllowTemplates] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [slackIntegration, setSlackIntegration] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Workspace Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workspace configuration and preferences
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <SettingsSection
        icon={Settings}
        title="General"
        description="Basic workspace information and settings"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workspace-name" className="text-sm">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Awesome Workspace"
                className="mt-1 h-8"
              />
            </div>
            <div>
              <Label htmlFor="workspace-slug" className="text-sm">Workspace URL</Label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-border rounded-l-md">
                  promption.com/
                </span>
                <Input
                  id="workspace-slug"
                  value={workspaceSlug}
                  disabled
                  className="rounded-l-none h-8"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                URL cannot be changed after creation
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="workspace-description" className="text-sm">Description</Label>
            <Textarea
              id="workspace-description"
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              placeholder="Describe what this workspace is for..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Privacy & Permissions */}
      <SettingsSection
        icon={Lock}
        title="Privacy & Permissions"
        description="Control who can access and interact with your workspace"
      >
        <div className="space-y-1">
          <SettingRow
            icon={Globe}
            label="Public Workspace"
            description="Allow anyone to discover and view public prompts in this workspace"
            badge={isPublic ? 'Public' : 'Private'}
            action={
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            }
          />
          
          <SettingRow
            icon={Users}
            label="Allow Comments"
            description="Let workspace members add comments and feedback on prompts"
            action={
              <Switch
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            }
          />

          <SettingRow
            icon={BarChart3}
            label="Template Creation"
            description="Allow members to create and share templates from prompts"
            action={
              <Switch
                checked={allowTemplates}
                onCheckedChange={setAllowTemplates}
              />
            }
          />
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Configure notification preferences for this workspace"
      >
        <div className="space-y-1">
          <SettingRow
            label="Email Notifications"
            description="Receive email updates about workspace activity"
            action={
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            }
          />
          
          <SettingRow
            label="Slack Integration"
            description="Send notifications to your Slack workspace"
            action={
              <div className="flex items-center gap-2">
                {!slackIntegration && (
                  <Button variant="outline" size="sm" className="h-7">
                    Connect Slack
                  </Button>
                )}
                <Switch
                  checked={slackIntegration}
                  onCheckedChange={setSlackIntegration}
                  disabled={!slackIntegration}
                />
              </div>
            }
          />
        </div>
      </SettingsSection>

      {/* Integrations */}
      <SettingsSection
        icon={Shield}
        title="Integrations"
        description="Connect external tools and services"
      >
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-muted/50 rounded-lg border-2 border-dashed border-border">
          <div className="p-2.5 bg-primary/10 rounded-full mb-3 pt-6">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            Integrations Coming Soon
          </h4>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground pb-6">
            Connect Promption to Slack, GitHub, and more to streamline your
            workflows. API access is also on the way.
          </p>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Irreversible actions that will permanently affect your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <DangerAction
            title="Transfer Ownership"
            description="Transfer this workspace to another member"
            buttonText="Transfer"
            variant="outline"
          />

          <DangerAction
            title="Archive Workspace"
            description="Make workspace read-only and hide from navigation"
            buttonText="Archive"
            variant="outline"
          />

          <DangerAction
            title="Delete Workspace"
            description="Permanently delete this workspace and all its content"
            buttonText="Delete"
            variant="destructive"
          />
        </CardContent>
      </Card>
    </div>
  )
} 