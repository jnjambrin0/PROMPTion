'use client'

import React, { useState, useCallback } from 'react'
import { Globe, Lock, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SlugInput } from '@/components/ui/slug-input'
import { validatePromptSlug } from '@/lib/actions/prompt'
import type { PromptSettingsResult } from '@/lib/actions/prompt-settings'

type SettingsData = NonNullable<PromptSettingsResult['data']>['prompt']

interface GeneralSettingsProps {
  settings: SettingsData
  categories: Array<{
    id: string
    name: string
    color: string | null
    icon: string | null
  }>
  isOwner: boolean
  canEdit: boolean
  onUpdate: (updates: Partial<SettingsData>) => void
}

// ✅ Client Component optimizado - memoizado para prevenir re-renders
export const GeneralSettings = React.memo(({ 
  settings, 
  categories,
  isOwner,
  canEdit,
  onUpdate 
}: GeneralSettingsProps) => {
  const [slugError, setSlugError] = useState<string | undefined>()

  const handleSlugValidation = useCallback(
    async (slug: string) => {
      if (!slug) return true
      try {
        const isValid = await validatePromptSlug(slug, settings.workspaceId, settings.id)
        if (!isValid) {
          setSlugError('This slug is already taken in this workspace.')
        } else {
          setSlugError(undefined)
        }
        return isValid
      } catch (validationError) {
        console.error('Slug validation failed:', validationError)
        setSlugError('Failed to validate slug.')
        return false
      }
    },
    [settings.workspaceId, settings.id]
  )

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
              disabled={!canEdit}
            />
          </div>
          
          <div className="space-y-2">
            <SlugInput
              value={settings.slug}
              onChange={(slug) => onUpdate({ slug })}
              title={settings.title}
              validateSlug={handleSlugValidation}
              placeholder="prompt-slug"
              isRequired
              onValidation={(_, validationErr) => setSlugError(validationErr)}
            />
            {slugError && <p className="text-sm text-red-600 mt-1">{slugError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value || null })}
              placeholder="Describe what this prompt does"
              rows={3}
              className="resize-none"
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={settings.categoryId || ''} 
              onValueChange={(value) => onUpdate({ categoryId: value === 'none' ? null : value })}
              disabled={!canEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility & Access</CardTitle>
          <CardDescription>
            Control who can see and use this prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="public-switch">Make Public</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Allow anyone with the link to view this prompt.
              </p>
            </div>
            <Switch
              id="public-switch"
              checked={settings.isPublic}
              onCheckedChange={(checked) => onUpdate({ isPublic: checked })}
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="template-switch">Make Template</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Allow others in the workspace to use this as a template.
              </p>
            </div>
            <Switch
              id="template-switch"
              checked={settings.isTemplate}
              onCheckedChange={(checked) => onUpdate({ isTemplate: checked })}
              disabled={!canEdit}
            />
          </div>

          {isOwner && (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="pinned-switch">Pin Prompt</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pin this prompt to the top of the workspace.
                </p>
              </div>
              <Switch
                id="pinned-switch"
                checked={settings.isPinned}
                onCheckedChange={(checked) => onUpdate({ isPinned: checked })}
                disabled={!canEdit}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})

GeneralSettings.displayName = 'GeneralSettings' 