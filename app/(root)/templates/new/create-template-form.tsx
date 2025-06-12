'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { 
  createTemplateSchema, 
  type CreateTemplateInput, 
  getFieldError 
} from '@/lib/validation-schemas'
import type { z } from 'zod'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

interface CreateTemplateFormProps {
  defaultWorkspaceId?: string
  defaultCategoryId?: string
}

export function CreateTemplateForm({ 
  defaultWorkspaceId, 
  defaultCategoryId 
}: CreateTemplateFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<CreateTemplateInput>({
    title: '',
    slug: '',
    description: '',
    workspaceId: defaultWorkspaceId || '',
    categoryId: defaultCategoryId,
    isPublic: true,
    icon: '🎯',
    templateType: 'prompt'
  })
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  const [isSlugValid, setIsSlugValid] = useState(true)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isCustomSlug, setIsCustomSlug] = useState(false)

  // Auto-generate slug from title unless user has customized it
  useEffect(() => {
    if (!isCustomSlug && formData.title) {
      const generatedSlug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, isCustomSlug])

  const validateForm = useCallback(() => {
    const result = createTemplateSchema.safeParse(formData)
    setErrors(result.error || null)
    return result.success
  }, [formData])

  useEffect(() => {
    const result = createTemplateSchema.safeParse(formData)
    setErrors(result.error || null)
    setIsFormValid(result.success)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    startTransition(async () => {
      try {
        // Here would go the actual API call
        // await createTemplate(formData)
        router.push(`/dashboard`)
      } catch (error) {
        console.error('Failed to create template:', error)
      }
    })
  }

  const handleSlugValidation = (isValid: boolean, error?: string) => {
    setIsSlugValid(isValid)
  }

  const getError = (field: keyof CreateTemplateInput) => {
    return errors ? getFieldError(errors, field) : undefined
  }

  const templateTypeOptions = [
    { value: 'prompt', label: 'Prompt Template', description: 'Reusable text prompts with variables' },
    { value: 'workflow', label: 'Workflow Template', description: 'Multi-step processes and chains' },
    { value: 'agent', label: 'Agent Template', description: 'AI agent configurations and behaviors' }
  ]

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
        onClick={handleSubmit}
        disabled={!isFormValid || isPending}
        className={isPending ? 'button-disabled' : ''}
      >
        {isPending ? 'Creating...' : 'Create template'}
      </Button>
    </div>
  )

  return (
    <CreateFormLayout
      title="Create template"
      subtitle="Build reusable templates that others can discover, use, and customize for their own workflows."
      backHref="/dashboard"
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <FieldGroup
          title="Basic information"
          description="Give your template a clear title and comprehensive description."
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <IconPicker
                value={formData.icon}
                onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
                placeholder="🎯"
              />
            </div>
            
            <div className="lg:col-span-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Template title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Blog Post Writing Assistant"
                  className={getError('title') ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                />
                {getError('title') && (
                  <p className="text-sm text-red-600">{getError('title')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || undefined }))}
                  placeholder="A comprehensive template for creating engaging blog posts with SEO optimization, structured content, and compelling calls-to-action..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  {formData.description?.length || 0}/500 characters
                </p>
                {getError('description') && (
                  <p className="text-sm text-red-600">{getError('description')}</p>
                )}
              </div>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Template type"
          description="What kind of template are you creating?"
        >
          <div className="space-y-3">
            <Label>Type <span className="text-red-500">*</span></Label>
            
            <div className="space-y-1">
              {templateTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, templateType: option.value as any }))}
                  className={`w-full flex items-center justify-between p-3 rounded-md text-left transition-all ${
                    formData.templateType === option.value
                      ? 'bg-gray-100 border border-gray-300'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide min-w-[60px]">
                        {option.value}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {formData.templateType === option.value && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-5 h-5 rounded-sm bg-gray-900 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Start with a Prompt Template if you're new to creating templates. 
                You can always create more complex workflows later.
              </p>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Organization"
          description="Choose which workspace and category this template belongs to."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workspace">
                Workspace <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.workspaceId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, workspaceId: value }))}
              >
                <SelectTrigger className={getError('workspaceId') ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select workspace..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temp">Personal Workspace</SelectItem>
                </SelectContent>
              </Select>
              {getError('workspaceId') && (
                <p className="text-sm text-red-600">{getError('workspaceId')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Select 
                value={formData.categoryId || 'none'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value === 'none' ? undefined : value }))}
                disabled={!formData.workspaceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Visibility & sharing"
          description="Control who can discover and use your template."
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium text-gray-900">Public template</h4>
                <p className="text-sm text-gray-600">
                  Make this template discoverable in the community library
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>

            {formData.isPublic && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium text-blue-900">Public Template Guidelines</h5>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Provide clear descriptions and examples</p>
                      <p>• Use appropriate categories and tags</p>
                      <p>• Follow community guidelines</p>
                      <p>• Include usage instructions if needed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FieldGroup>

        <FieldGroup
          title="Preview"
          description="See how your template will appear in the library."
        >
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-25">
            <div className="flex items-start gap-4">
              <span className="text-2xl">{formData.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {formData.title || 'Template title'}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className="text-xs capitalize"
                  >
                    {formData.templateType}
                  </Badge>
                  {formData.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      Public
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {formData.description || 'Template description will appear here...'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>0 uses</span>
                  <span>•</span>
                  <span>0 favorites</span>
                  <span>•</span>
                  <span>Just created</span>
                </div>
              </div>
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
            baseUrl="promption.com/t"
            onValidation={handleSlugValidation}
            placeholder="blog-post-assistant"
          />
        </FieldGroup>
      </form>
    </CreateFormLayout>
  )
} 