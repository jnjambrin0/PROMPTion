'use client'

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Settings, 
  Database, 
  Zap, 
  Bell, 
  BarChart3,
  Globe,
  Lock,
  Bot,
  Webhook,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import React from 'react'

// Types for settings
interface PromptSettings {
  // General settings
  title: string
  description: string
  tags: string[]
  category: string
  isPublic: boolean
  isTemplate: boolean
  isArchived: boolean
  
  // Permissions
  collaborators: Array<{
    id: string
    email: string
    role: 'owner' | 'editor' | 'viewer'
    addedAt: string
  }>
  
  // AI Configuration
  aiModel: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  
  // Integrations
  webhookUrl: string
  apiAccess: boolean
  
  // Notifications
  emailNotifications: boolean
  commentNotifications: boolean
  usageNotifications: boolean
}

interface PromptSettingsClientProps {
  workspaceSlug: string
  promptSlug: string
  userId: string
}

interface SaveState {
  status: 'saved' | 'saving' | 'unsaved' | 'error'
  lastSaved?: Date
  error?: string
}

// Memoized General Settings Component
const GeneralSettings = React.memo(({ 
  settings, 
  onUpdate 
}: { 
  settings: PromptSettings
  onUpdate: (updates: Partial<PromptSettings>) => void 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update the basic details of your prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter prompt title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe what this prompt does"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={settings.category} onValueChange={(value) => onUpdate({ category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="content">Content Creation</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="code">Code Generation</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility & Access</CardTitle>
          <CardDescription>
            Control who can see and use your prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-neutral-600" />
                <Label htmlFor="public">Public</Label>
              </div>
              <p className="text-xs text-neutral-500">
                Allow anyone to view and use this prompt
              </p>
            </div>
            <Switch
              id="public"
              checked={settings.isPublic}
              onCheckedChange={(checked) => onUpdate({ isPublic: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-neutral-600" />
                <Label htmlFor="template">Template</Label>
              </div>
              <p className="text-xs text-neutral-500">
                Make available in the template library
              </p>
            </div>
            <Switch
              id="template"
              checked={settings.isTemplate}
              onCheckedChange={(checked) => onUpdate({ isTemplate: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-neutral-600" />
                <Label htmlFor="archived">Archived</Label>
              </div>
              <p className="text-xs text-neutral-500">
                Hide from workspace but keep accessible via direct link
              </p>
            </div>
            <Switch
              id="archived"
              checked={settings.isArchived}
              onCheckedChange={(checked) => onUpdate({ isArchived: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

// Memoized Permissions Component
const PermissionsSettings = React.memo(({ 
  settings, 
  onUpdate 
}: { 
  settings: PromptSettings
  onUpdate: (updates: Partial<PromptSettings>) => void 
}) => {
  const [newEmail, setNewEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)

  const handleInvite = useCallback(async () => {
    if (!newEmail.trim()) return

    setIsInviting(true)
    try {
      // TODO: Implement actual invite logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCollaborator = {
        id: Date.now().toString(),
        email: newEmail,
        role: 'viewer' as const,
        addedAt: 'Just now'
      }
      
      onUpdate({
        collaborators: [...settings.collaborators, newCollaborator]
      })
      
      setNewEmail('')
      toast.success('Invitation sent successfully')
    } catch (error) {
      toast.error('Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }, [newEmail, settings.collaborators, onUpdate])

  const handleRemoveCollaborator = useCallback((collaboratorId: string) => {
    onUpdate({
      collaborators: settings.collaborators.filter(c => c.id !== collaboratorId)
    })
    toast.success('Collaborator removed')
  }, [settings.collaborators, onUpdate])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborators</CardTitle>
        <CardDescription>
          Manage who can access and edit this prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Enter email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
          <Button 
            variant="outline" 
            onClick={handleInvite}
            disabled={isInviting || !newEmail.trim()}
          >
            <Users className="h-4 w-4 mr-2" />
            {isInviting ? 'Inviting...' : 'Invite'}
          </Button>
        </div>

        <div className="space-y-2">
          {settings.collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-md">
              <div>
                <p className="text-sm font-medium text-neutral-900">{collaborator.email}</p>
                <p className="text-xs text-neutral-500">Added {collaborator.addedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={collaborator.role === 'owner' ? 'default' : 'secondary'}>
                  {collaborator.role}
                </Badge>
                {collaborator.role !== 'owner' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

// Memoized AI Config Component
const AIConfigSettings = React.memo(({ 
  settings, 
  onUpdate 
}: { 
  settings: PromptSettings
  onUpdate: (updates: Partial<PromptSettings>) => void 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Configuration</CardTitle>
        <CardDescription>
          Configure AI model parameters for this prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model">AI Model</Label>
          <Select value={settings.aiModel} onValueChange={(value) => onUpdate({ aiModel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-o3-mini">GPT-o3 Mini</SelectItem>
              <SelectItem value="gpt-o3">GPT-o3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature">Temperature</Label>
            <span className="text-sm text-neutral-600">{settings.temperature}</span>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[settings.temperature]}
            onValueChange={([value]) => onUpdate({ temperature: value })}
            className="w-full"
          />
          <p className="text-xs text-neutral-500">
            Controls randomness. Higher values = more creative, lower = more focused.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-tokens">Max Tokens</Label>
          <Input
            id="max-tokens"
            type="number"
            value={settings.maxTokens}
            onChange={(e) => onUpdate({ maxTokens: parseInt(e.target.value) || 0 })}
            placeholder="4096"
          />
          <p className="text-xs text-neutral-500">
            Maximum length of the response
          </p>
        </div>
      </CardContent>
    </Card>
  )
})

// Memoized Advanced Settings Component
const AdvancedSettings = React.memo(({ 
  settings, 
  onUpdate,
  onDelete 
}: { 
  settings: PromptSettings
  onUpdate: (updates: Partial<PromptSettings>) => void
  onDelete: () => void
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Access & Notifications</CardTitle>
          <CardDescription>
            Configure advanced settings for this prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-neutral-600" />
                <Label htmlFor="api">API Access</Label>
              </div>
              <p className="text-xs text-neutral-500">
                Allow this prompt to be accessed via API
              </p>
            </div>
            <Switch
              id="api"
              checked={settings.apiAccess}
              onCheckedChange={(checked) => onUpdate({ apiAccess: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              value={settings.webhookUrl}
              onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
              placeholder="https://your-app.com/webhooks/prompt-completed"
            />
            <p className="text-xs text-neutral-500">
              We'll send a POST request here when this prompt is executed
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-neutral-900">Notification Preferences</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-neutral-600" />
                  <Label htmlFor="email-notifs">Email Notifications</Label>
                </div>
                <p className="text-xs text-neutral-500">
                  Receive email updates about this prompt
                </p>
              </div>
              <Switch
                id="email-notifs"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => onUpdate({ emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-600" />
                  <Label htmlFor="comment-notifs">Comment Notifications</Label>
                </div>
                <p className="text-xs text-neutral-500">
                  Get notified when someone comments on this prompt
                </p>
              </div>
              <Switch
                id="comment-notifs"
                checked={settings.commentNotifications}
                onCheckedChange={(checked) => onUpdate({ commentNotifications: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Delete this prompt permanently. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-red-600">
                Are you sure you want to delete this prompt? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={onDelete}
                >
                  Yes, delete permanently
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Prompt
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
})

export function PromptSettingsClient({ workspaceSlug, promptSlug, userId }: PromptSettingsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  
  const [saveState, setSaveState] = useState<SaveState>({
    status: 'saved'
  })
  
  const [settings, setSettings] = useState<PromptSettings>({
    title: '',
    description: '',
    tags: [],
    category: 'content',
    isPublic: false,
    isTemplate: false,
    isArchived: false,
    collaborators: [],
    aiModel: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    webhookUrl: '',
    apiAccess: false,
    emailNotifications: true,
    commentNotifications: true,
    usageNotifications: false
  })

  // Track initial state
  const [initialSettings, setInitialSettings] = useState<PromptSettings | null>(null)

  // Workspace metadata
  const [workspaceName, setWorkspaceName] = useState('')

  // Check for unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!initialSettings) return false
    return JSON.stringify(settings) !== JSON.stringify(initialSettings)
  }, [settings, initialSettings])

  // Load settings data - only run once
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        const mockSettings: PromptSettings = {
          title: 'Blog Post Generator',
          description: 'Generate engaging blog posts with SEO optimization',
          tags: ['blog', 'content', 'seo'],
          category: 'content',
          isPublic: true,
          isTemplate: false,
          isArchived: false,
          collaborators: [
            {
              id: '1',
              email: 'john@example.com',
              role: 'owner',
              addedAt: '2 days ago'
            },
            {
              id: '2',
              email: 'sarah@example.com',
              role: 'editor',
              addedAt: '1 week ago'
            }
          ],
          aiModel: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 4096,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
          webhookUrl: '',
          apiAccess: true,
          emailNotifications: true,
          commentNotifications: true,
          usageNotifications: false
        }

        setSettings(mockSettings)
        setInitialSettings(mockSettings)
        setWorkspaceName('Content Creation')
        setSaveState({ status: 'saved', lastSaved: new Date() })
        setIsLoading(false)
      } catch (error) {
        toast.error('Failed to load settings')
        setSaveState({ status: 'error', error: 'Failed to load settings' })
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [workspaceSlug, promptSlug])

  const updateSettings = useCallback((updates: Partial<PromptSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    setSaveState(prev => ({ ...prev, status: 'unsaved' }))
  }, [])

  const handleManualSave = useCallback(() => {
    startTransition(async () => {
      try {
        setSaveState({ status: 'saving' })
        // TODO: Implement actual save logic
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setSaveState({ status: 'saved', lastSaved: new Date() })
        setInitialSettings({ ...settings })
        toast.success('Settings saved successfully')
      } catch (error) {
        setSaveState({ status: 'error', error: 'Failed to save settings' })
        toast.error('Failed to save settings')
      }
    })
  }, [settings])

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      try {
        // TODO: Implement actual delete logic
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.success('Prompt deleted successfully')
        router.push(`/${workspaceSlug}`)
      } catch (error) {
        toast.error('Failed to delete prompt')
      }
    })
  }, [workspaceSlug, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${workspaceSlug}/${promptSlug}`}
            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to prompt
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-neutral-900">Prompt Settings</h1>
            <Badge variant="secondary" className="text-xs">
              {workspaceName}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <div className="text-xs text-yellow-600">
              {saveState.status === 'saving' ? 'Saving...' : 'Unsaved changes'}
            </div>
          )}
          <Link href={`/${workspaceSlug}/${promptSlug}/edit`}>
            <Button variant="outline" size="sm">
              Edit Prompt
            </Button>
          </Link>
          <Button
            onClick={handleManualSave}
            disabled={isPending || saveState.status === 'saving' || !hasUnsavedChanges}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Separator />

      {/* Settings Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-neutral-50 border border-neutral-200 rounded-lg">
          <TabsTrigger value="general" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4" />
            <span className="font-medium">General</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="h-4 w-4" />
            <span className="font-medium">Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Bot className="h-4 w-4" />
            <span className="font-medium">AI Config</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Webhook className="h-4 w-4" />
            <span className="font-medium">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-8">
          <GeneralSettings settings={settings} onUpdate={updateSettings} />
        </TabsContent>

        <TabsContent value="permissions" className="mt-8">
          <PermissionsSettings settings={settings} onUpdate={updateSettings} />
        </TabsContent>

        <TabsContent value="ai" className="mt-8">
          <AIConfigSettings settings={settings} onUpdate={updateSettings} />
        </TabsContent>

        <TabsContent value="integrations" className="mt-8">
          <AdvancedSettings 
            settings={settings} 
            onUpdate={updateSettings}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 