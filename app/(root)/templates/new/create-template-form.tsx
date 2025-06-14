'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@/lib/hooks/use-form'
import { 
  BaseForm, 
  BasicInfoFields, 
  SelectField, 
  VisibilityFields, 
  PreviewField, 
  SlugField 
} from '@/components/ui/base-form'
import { FieldGroup } from '@/components/ui/field-group'
import { type CreateTemplateInput } from '@/lib/validation-schemas'
import { createTemplateAction, getWorkspacesAction, getTemplateCategoriesAction } from '@/lib/actions/data'
import { toast } from 'sonner'

// ==================== INTERFACES ====================

interface CreateTemplateFormProps {
  defaultWorkspaceId?: string
  defaultCategoryId?: string
}

interface Workspace {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  count: number
  icon: string | null
}

// ==================== TEMPLATE TYPE OPTIONS ====================

const templateTypeOptions = [
  { 
    value: 'prompt', 
    label: 'Prompt Template', 
    description: 'Reusable text prompts with variables' 
  },
  { 
    value: 'workflow', 
    label: 'Workflow Template', 
    description: 'Multi-step processes and chains' 
  },
  { 
    value: 'agent', 
    label: 'Agent Template', 
    description: 'AI agent configurations and behaviors' 
  }
]

// ==================== MAIN COMPONENT ====================

export function CreateTemplateForm({ 
  defaultWorkspaceId, 
  defaultCategoryId 
}: CreateTemplateFormProps) {
  const router = useRouter()
  
  // Data states
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Form logic with unified hook
  const form = useForm({
    initialData: {
      title: '',
      slug: '',
      description: '',
      workspaceId: defaultWorkspaceId || '',
      categoryId: defaultCategoryId,
      isPublic: true,
      icon: '🎯',
      templateType: 'prompt' as const
    },
    generateSlug: true,
    onSubmit: async (data) => {
      const result = await createTemplateAction(data)
      if (result.success) {
        return { 
          success: true, 
          redirectTo: '/dashboard' 
        }
      }
      return { 
        success: false, 
        error: result.error || 'Failed to create template' 
      }
    },
    onSuccess: () => {
      toast.success('Template created successfully')
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [workspacesResult, categoriesResult] = await Promise.all([
          getWorkspacesAction(),
          getTemplateCategoriesAction()
        ])

        if (workspacesResult.success) {
          setWorkspaces(workspacesResult.data || [])
          
          // Set default workspace if not already set
          if (!form.data.workspaceId && workspacesResult.data?.length) {
            form.updateField('workspaceId', workspacesResult.data[0].id)
          }
        }

        if (categoriesResult.success) {
          setCategories(categoriesResult.data || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [])

  // Loading state
  if (isLoadingData) {
    return (
      <BaseForm
        title="Create template"
        subtitle="Build reusable templates that others can discover, use, and customize for their own workflows."
        backHref="/dashboard"
        onSubmit={() => {}}
        onCancel={() => router.back()}
        isSubmitting={false}
        canSubmit={false}
      >
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading form data...</p>
        </div>
      </BaseForm>
    )
  }

  // Prepare data for components
  const workspaceOptions = workspaces.map(ws => ({
    value: ws.id,
    label: ws.name
  }))

  const categoryOptions = [
    { value: 'none', label: 'No category' },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  ]

  return (
    <BaseForm
      title="Create template"
      subtitle="Build reusable templates that others can discover, use, and customize for their own workflows."
      backHref="/dashboard"
      onSubmit={form.handleSubmit}
      onCancel={() => router.back()}
      isSubmitting={form.isSubmitting}
      canSubmit={form.canSubmit}
      submitLabel="Create template"
    >
      {/* Basic Information */}
      <BasicInfoFields
        icon={form.data.icon}
        onIconChange={(icon) => form.updateField('icon', icon)}
        title={form.data.title}
        onTitleChange={(title) => form.updateField('title', title)}
        description={form.data.description}
        onDescriptionChange={(description) => form.updateField('description', description)}
        titleError={form.getFieldError('title') || undefined}
        descriptionError={form.getFieldError('description') || undefined}
      />

      {/* Template Type */}
      <FieldGroup
        title="Template type"
        description="What kind of template are you creating?"
      >
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Type <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-1">
            {templateTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => form.updateField('templateType', option.value)}
                className={`w-full flex items-center justify-between p-3 rounded-md text-left transition-all ${
                  form.data.templateType === option.value
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
                
                {form.data.templateType === option.value && (
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

      {/* Organization */}
      <FieldGroup
        title="Organization"
        description="Choose which workspace and category this template belongs to."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SelectField
            label="Workspace"
            value={form.data.workspaceId}
            onChange={(value) => form.updateField('workspaceId', value)}
            options={workspaceOptions}
            placeholder="Select workspace..."
            required
            error={form.getFieldError('workspaceId') || undefined}
            loading={workspaces.length === 0}
          />

          <SelectField
            label="Category"
            value={form.data.categoryId || 'none'}
            onChange={(value) => form.updateField('categoryId', value === 'none' ? undefined : value)}
            options={categoryOptions}
            placeholder="Select category..."
            error={form.getFieldError('categoryId') || undefined}
          />
        </div>
      </FieldGroup>

      {/* Visibility */}
      <VisibilityFields
        isPublic={form.data.isPublic}
        onPublicChange={(isPublic) => form.updateField('isPublic', isPublic)}
        publicLabel="Public template"
        publicDescription="Make this template discoverable in the community library"
      />

      {/* Preview */}
      <PreviewField
        icon={form.data.icon}
        title={form.data.title}
        description={form.data.description}
        badges={[
          { label: form.data.templateType, variant: 'outline' },
          ...(form.data.isPublic ? [{ label: 'Public', variant: 'secondary' as const }] : [])
        ]}
      />

      {/* Advanced Options */}
      <SlugField
        value={form.data.slug}
        onChange={(slug) => form.updateField('slug', slug)}
        title={form.data.title}
        baseUrl="promption.com/t"
        isCustomSlug={form.isCustomSlug}
        error={form.getFieldError('slug') || undefined}
      />
    </BaseForm>
  )
} 