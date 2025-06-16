'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateFormLayout } from '@/components/ui/create-form-layout'
import { FieldGroup } from '@/components/ui/field-group'
import { SlugInput } from '@/components/ui/slug-input'
import { IconPicker } from '@/components/ui/icon-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createPromptAction, validatePromptSlug, getWorkspaceData, getUserWorkspacesData } from '@/lib/actions/prompt'
import type { CreatePromptData } from '@/lib/types/forms'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

interface CreatePromptFormProps {
  defaultWorkspaceId?: string
  defaultCategoryId?: string
}

interface Category {
  id: string
  name: string
  icon?: string | null
}

interface Workspace {
  id: string
  name: string
}

export function CreatePromptForm({ defaultWorkspaceId }: CreatePromptFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [formData, setFormData] = useState<CreatePromptData>({
    title: '',
    slug: '',
    description: '',
    workspaceId: '',
    categoryId: '',
    isTemplate: false,
    isPublic: false,
    icon: '📝'
  })
  const [errors, setErrors] = useState<Partial<CreatePromptData>>({})
  const [isCustomSlug, setIsCustomSlug] = useState(false)

  // Load user workspaces on mount
  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const { workspaces } = await getUserWorkspacesData()
        setWorkspaces(workspaces)
        
        // Set default workspace if provided and valid
        if (defaultWorkspaceId && workspaces.some(w => w.id === defaultWorkspaceId)) {
          setFormData(prev => ({ ...prev, workspaceId: defaultWorkspaceId }))
        } else if (workspaces.length > 0) {
          // Set first workspace as default
          setFormData(prev => ({ ...prev, workspaceId: workspaces[0].id }))
        }
      } catch (error) {
        console.error('Error loading workspaces:', error)
      } finally {
        setIsLoadingWorkspaces(false)
      }
    }

    loadWorkspaces()
  }, [defaultWorkspaceId])

  // Auto-generate slug from title unless user has customized it
  useEffect(() => {
    if (!isCustomSlug && formData.title) {
      const generatedSlug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, isCustomSlug])

  const isFormValid = formData.title.length >= 3 && formData.workspaceId && !isPending

  // Load workspace data when workspace changes
  useEffect(() => {
    if (formData.workspaceId) {
      const loadCategories = async () => {
        try {
          setIsLoadingCategories(true)
          const data = await getWorkspaceData(formData.workspaceId)
          setCategories(data.categories)
        } catch (error) {
          console.error('Error loading categories:', error)
          setCategories([])
        } finally {
          setIsLoadingCategories(false)
        }
      }
      loadCategories()
    } else {
      setCategories([])
    }
  }, [formData.workspaceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid || isPending) return

    startTransition(async () => {
      try {
        // Clean up form data before submission
        const cleanedData = {
          ...formData,
          categoryId: formData.categoryId && formData.categoryId !== 'none' && formData.categoryId !== '' 
            ? formData.categoryId 
            : undefined,
          description: formData.description?.trim() || undefined
        }

        const result = await createPromptAction(cleanedData)
        
        if (result.success && result.promptSlug && result.workspaceSlug) {
          router.push(`/${result.workspaceSlug}/${result.promptSlug}`)
        } else {
          setErrors({ title: result.error || 'Failed to create prompt' })
        }
      } catch (error) {
        console.error('Error in handleSubmit:', error)
        setErrors({ title: 'An unexpected error occurred. Please try again.' })
      }
    })
  }

  const handleSlugValidation = (isValid: boolean, error?: string) => {
    if (error) {
      setErrors(prev => ({ ...prev, slug: error }))
    } else {
      setErrors(prev => ({ ...prev, slug: undefined }))
    }
  }

  const validateSlug = async (slug: string) => {
    if (!formData.workspaceId || !slug || slug.length < 3) return false
    try {
      return await validatePromptSlug(slug, formData.workspaceId)
    } catch (error) {
      console.error('Error validating slug:', error)
      return false
    }
  }

  const actions = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="prompt-form"
        disabled={!isFormValid || isPending}
        className="min-w-[140px]"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Creating...</span>
          </div>
        ) : (
          'Create prompt'
        )}
      </Button>
    </div>
  )

  if (isLoadingWorkspaces) {
    return (
      <CreateFormLayout
        title="Create prompt"
        subtitle="Build reusable prompts for your AI workflows."
        backHref="/dashboard"
        actions={<div />}
      >
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading workspaces...</p>
        </div>
      </CreateFormLayout>
    )
  }

  if (workspaces.length === 0) {
    return (
      <CreateFormLayout
        title="Create prompt"
        subtitle="You need a workspace to create prompts."
        backHref="/dashboard"
        actions={
          <Button onClick={() => router.push('/workspaces/new')}>
            Create workspace
          </Button>
        }
      >
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workspaces found
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            You need to create a workspace before you can create prompts.
          </p>
        </div>
      </CreateFormLayout>
    )
  }

  return (
    <CreateFormLayout
      title="Create prompt"
      subtitle="Build reusable prompts for your AI workflows. Add variables, examples, and organize with categories."
      backHref="/dashboard"
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="mb-4" id="prompt-form">
        <FieldGroup
          title="Basic information"
          description="Give your prompt a clear title."
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <IconPicker
                value={formData.icon}
                onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
              />
            </div>
            
            <div className="lg:col-span-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Write a blog post"
                  className={errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A prompt for writing engaging blog posts with SEO optimization..."
                  rows={3}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  {formData.description?.length || 0}/500 characters
                </p>
              </div>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Organization"
          description="Choose where to store your prompt and how to categorize it."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workspace">
                Workspace <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.workspaceId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, workspaceId: value, categoryId: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workspace..." />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Select 
                value={formData.categoryId || 'none'} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  categoryId: value === 'none' ? '' : value 
                }))}
                disabled={!formData.workspaceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Settings"
          description="Configure how your prompt behaves and who can access it."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isTemplate">Template</Label>
                <p className="text-sm text-gray-600">
                  Make this prompt available as a template for others to use
                </p>
              </div>
              <Switch
                id="isTemplate"
                checked={formData.isTemplate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTemplate: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isPublic">Public</Label>
                <p className="text-sm text-gray-600">
                  Allow anyone to view and use this prompt
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Advanced options"
          description="Customize URL slug and other advanced settings."
          isAdvanced={true}
          isLast={true}
        >
          <SlugInput
            value={formData.slug || ''}
            onChange={(slug) => {
              setFormData(prev => ({ ...prev, slug }))
              setIsCustomSlug(true)
            }}
            title={formData.title}
            baseUrl="promption.com/p"
            onValidation={handleSlugValidation}
            validateSlug={formData.workspaceId ? validateSlug : undefined}
            placeholder="write-blog-post"
          />
        </FieldGroup>
      </form>
    </CreateFormLayout>
  )
} 