'use client'

import { useState } from 'react'
import { Settings, Globe, Lock, Bell, Trash2, Save, AlertTriangle, Users, BarChart3, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WorkspaceSettingsTabProps {
  workspaceSlug: string
  workspaceData: {
    workspace: any
    categories: any[]
    members: any[]
    prompts?: any[]
    stats?: any
  }
}

export default function WorkspaceSettingsTab({ workspaceSlug, workspaceData }: WorkspaceSettingsTabProps) {
  const { workspace } = workspaceData
  
  const [workspaceName, setWorkspaceName] = useState(workspace.name || '')
  const [workspaceDescription, setWorkspaceDescription] = useState(workspace.description || '')
  const [isPublic, setIsPublic] = useState(workspace.isPublic || false)
  const [allowComments, setAllowComments] = useState(true)
  const [allowTemplates, setAllowTemplates] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [slackIntegration, setSlackIntegration] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workspace Settings</h2>
          <p className="text-gray-600 mt-1">
            Manage your workspace configuration and preferences
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <CardTitle>General</CardTitle>
          </div>
          <CardDescription>
            Basic workspace information and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Awesome Workspace"
              />
            </div>
          <div>
              <Label htmlFor="workspace-slug">Workspace URL</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                  promption.com/
                </span>
            <Input
                  id="workspace-slug"
                  value={workspaceSlug}
                  disabled
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                URL cannot be changed after creation
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="workspace-description">Description</Label>
            <Textarea
              id="workspace-description"
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              placeholder="Describe what this workspace is for..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Permissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-600" />
            <CardTitle>Privacy & Permissions</CardTitle>
          </div>
          <CardDescription>
            Control who can access and interact with your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <Label className="text-sm font-medium">Public Workspace</Label>
                <Badge variant={isPublic ? 'default' : 'outline'} className="text-xs">
                  {isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Allow anyone to discover and view public prompts in this workspace
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <Label className="text-sm font-medium">Allow Comments</Label>
              </div>
              <p className="text-sm text-gray-600">
                Let workspace members add comments and feedback on prompts
              </p>
            </div>
            <Switch
              checked={allowComments}
              onCheckedChange={setAllowComments}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-600" />
                <Label className="text-sm font-medium">Template Creation</Label>
              </div>
              <p className="text-sm text-gray-600">
                Allow members to create and share templates from prompts
              </p>
            </div>
            <Switch
              checked={allowTemplates}
              onCheckedChange={setAllowTemplates}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure notification preferences for this workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-sm text-gray-600">
                Receive email updates about workspace activity
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Slack Integration</Label>
              <p className="text-sm text-gray-600">
                Send notifications to your Slack workspace
              </p>
              {!slackIntegration && (
                <Button variant="outline" size="sm" className="mt-2">
                  Connect Slack
                </Button>
              )}
            </div>
            <Switch
              checked={slackIntegration}
              onCheckedChange={setSlackIntegration}
              disabled={!slackIntegration}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-600" />
            <CardTitle>Integrations</CardTitle>
          </div>
          <CardDescription>
            Connect external tools and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                    <span className="text-sm font-bold" style={{ color: '#9333EA' }}>S</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Slack</h4>
                    <p className="text-sm text-gray-600">Team communication</p>
        </div>
      </div>
                <Button variant="outline" size="sm" className="w-full">
                  {slackIntegration ? 'Configure' : 'Connect'}
                </Button>
              </div>
        
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FED7AA' }}>
                    <span className="text-sm font-bold" style={{ color: '#EA580C' }}>N</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Notion</h4>
                    <p className="text-sm text-gray-600">Documentation sync</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Connect
                </Button>
          </div>
          
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-sm font-bold" style={{ color: '#2563EB' }}>G</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">GitHub</h4>
                    <p className="text-sm text-gray-600">Code integration</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Connect
                </Button>
          </div>
          
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                    <span className="text-sm font-bold" style={{ color: '#16A34A' }}>F</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Figma</h4>
                    <p className="text-sm text-gray-600">Design workflow</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Connect
                </Button>
          </div>
        </div>
      </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            Irreversible actions that will permanently affect your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-red-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Transfer Ownership</h4>
                <p className="text-sm text-gray-600">
                  Transfer this workspace to another member
                </p>
              </div>
              <Button variant="outline" size="sm">
                Transfer
              </Button>
            </div>
          </div>

          <div className="border border-red-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Archive Workspace</h4>
                <p className="text-sm text-gray-600">
                  Make workspace read-only and hide from navigation
                </p>
        </div>
              <Button variant="outline" size="sm">
                Archive
              </Button>
      </div>
    </div>

          <div className="border border-red-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-900">Delete Workspace</h4>
                <p className="text-sm text-red-600">
                  Permanently delete this workspace and all its content
                </p>
        </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 