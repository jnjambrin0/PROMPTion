'use client'

import { useState, useTransition, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Save, Users, Settings, Bot, Webhook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { toast } from 'sonner'
import React from 'react'

// Import modular components
import { 
  GeneralSettings, 
  CollaboratorsSettings, 
  AIConfigSettings, 
  AdvancedSettings 
} from '@/components/prompt-settings'

// Import server actions
import { 
  getPromptSettingsAction, 
  updatePromptSettingsAction,
  type PromptSettingsResult
} from '@/lib/actions/prompt-settings'

type SettingsData = NonNullable<PromptSettingsResult['data']>['prompt']
interface PromptSettingsClientProps {
  workspaceSlug: string
  promptSlug: string
  userId: string
  initialData: PromptSettingsResult['data']
}

interface SaveState {
  status: 'saved' | 'saving' | 'unsaved' | 'error'
  lastSaved?: Date
  error?: string
}

interface LoadingState {
  initial: boolean
  action: boolean
}

export function PromptSettingsClient({ workspaceSlug, promptSlug, initialData }: PromptSettingsClientProps) {
  void workspaceSlug // Used in JSX
  void promptSlug // Used in JSX
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState<LoadingState>({
    initial: false,
    action: false
  })
  const [activeTab, setActiveTab] = useState('general')
  
  const [saveState, setSaveState] = useState<SaveState>({
    status: 'saved'
  })
  
  const [settingsData, setSettingsData] = useState<PromptSettingsResult['data'] | null>(initialData)
  const [formData, setFormData] = useState<SettingsData | null>(initialData?.prompt || null)
  const [initialFormData, setInitialFormData] = useState<SettingsData | null>(initialData?.prompt || null)

  const hasUnsavedChanges = useMemo(() => {
    if (!initialFormData || !formData) return false
    return JSON.stringify(formData) !== JSON.stringify(initialFormData)
  }, [formData, initialFormData])

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }))
      setSaveState({ status: 'saved' })
      
      const result = await getPromptSettingsAction(workspaceSlug, promptSlug)
      
      if (!result.success) {
        toast.error(result.error || 'Failed to load settings')
        setSaveState({ status: 'error', error: result.error })
        return
      }

      if (result.data) {
        setSettingsData(result.data)
        setFormData(result.data.prompt)
        setInitialFormData(result.data.prompt)
        setSaveState({ status: 'saved', lastSaved: new Date() })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
      setSaveState({ status: 'error', error: 'Failed to load settings' })
    } finally {
      setLoading(prev => ({ ...prev, initial: false }))
    }
  }, [workspaceSlug, promptSlug])

  const updateFormData = useCallback((updates: Partial<SettingsData>) => {
    setFormData(prev => prev ? { ...prev, ...updates } : null)
    setSaveState(prev => ({ ...prev, status: 'unsaved' }))
  }, [])

  const handleSave = useCallback(() => {
    if (!formData || !settingsData) return

    startTransition(async () => {
      try {
        setSaveState({ status: 'saving' })
        setLoading(prev => ({ ...prev, action: true }))
        
        const result = await updatePromptSettingsAction(settingsData.prompt.id, formData)
        
        if (result.success) {
          setInitialFormData({ ...formData })
          setSaveState({ status: 'saved', lastSaved: new Date() })
          toast.success('Settings saved successfully')
        } else {
          setSaveState({ status: 'error', error: result.error })
          toast.error(result.error || 'Failed to save settings')
        }
      } catch (error) {
        console.error('Error saving settings:', error)
        setSaveState({ status: 'error', error: 'Failed to save settings' })
        toast.error('Failed to save settings')
      } finally {
        setLoading(prev => ({ ...prev, action: false }))
      }
    })
  }, [formData, settingsData])

  if (loading.initial) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
        </div>
      </div>
    )
  }

  if (!settingsData || !formData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-2">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Settings</CardTitle>
            <CardDescription>
              {saveState.error || 'Failed to load prompt settings'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchSettings} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

      return (
      <div className="max-w-4xl mx-auto space-y-6 p-2 md:p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/${workspaceSlug}`}>{settingsData.workspace.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/${workspaceSlug}/${promptSlug}`}>{settingsData.prompt.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-semibold text-neutral-900">Prompt Settings</h1>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            {hasUnsavedChanges && (
              <div className="text-xs text-yellow-600">
                {saveState.status === 'saving' ? 'Saving...' : 'Unsaved changes'}
              </div>
            )}
            <div className="flex gap-2">
              <Link href={`/${workspaceSlug}/${promptSlug}/edit`}>
                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                  Edit Prompt
                </Button>
              </Link>
              <Button
                onClick={handleSave}
                disabled={isPending || saveState.status === 'saving' || !hasUnsavedChanges}
                className="gap-2 flex-1 md:flex-none"
                variant="outline"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </div>
          </div>
        </div>

      <Separator />

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-12 p-1 bg-neutral-50 border border-neutral-200 rounded-lg">
            <TabsTrigger value="general" className="flex items-center gap-1 md:gap-2 h-10 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4" />
              <span className="font-medium">General</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-1 md:gap-2 h-10 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="h-4 w-4" />
              <span className="font-medium hidden sm:inline">Permissions</span>
              <span className="font-medium sm:hidden">Perms</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1 md:gap-2 h-10 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bot className="h-4 w-4" />
              <span className="font-medium">AI Config</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1 md:gap-2 h-10 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Webhook className="h-4 w-4" />
              <span className="font-medium">Advanced</span>
            </TabsTrigger>
          </TabsList>

        <TabsContent value="general">
          <GeneralSettings 
            settings={formData}
            categories={settingsData.categories}
            isOwner={settingsData.isOwner}
            canEdit={settingsData.canEdit}
            onUpdate={updateFormData}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <CollaboratorsSettings 
            promptId={settingsData.prompt.id}
            collaborators={settingsData.collaborators}
            isOwner={settingsData.isOwner}
            canEdit={settingsData.canEdit}
            onUpdate={fetchSettings}
          />
        </TabsContent>

        <TabsContent value="ai">
          <AIConfigSettings 
            settings={formData}
            canEdit={settingsData.canEdit}
            onUpdate={updateFormData}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedSettings 
            promptId={settingsData.prompt.id}
            settings={formData}
            isOwner={settingsData.isOwner}
            canEdit={settingsData.canEdit}
            workspaceSlug={workspaceSlug}
            onUpdate={updateFormData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 