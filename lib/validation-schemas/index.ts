import { z } from 'zod'

// Base validation rules
const slugRegex = /^[a-z0-9-]+$/
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Common field validations
export const baseValidations = {
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  
  slug: z.string()
    .min(3, 'URL slug must be at least 3 characters')
    .max(50, 'URL slug must be less than 50 characters')
    .regex(slugRegex, 'Only lowercase letters, numbers, and hyphens allowed')
    .trim()
    .optional(),
  
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  
  shortDescription: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  
  workspaceId: z.string()
    .regex(uuidRegex, 'Invalid workspace ID'),
  
  categoryId: z.string()
    .regex(uuidRegex, 'Invalid category ID')
    .optional(),
  
  icon: z.string()
    .emoji('Must be a valid emoji')
    .optional(),
  
  color: z.enum(['gray', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo'])
    .optional()
    .default('gray')
}

// Workspace validation schema
export const createWorkspaceSchema = z.object({
  name: baseValidations.name,
  slug: baseValidations.slug,
  description: baseValidations.shortDescription,
  logoUrl: z.string().url('Must be a valid URL').optional()
})

// Prompt validation schema
export const createPromptSchema = z.object({
  title: baseValidations.title,
  slug: baseValidations.slug,
  description: baseValidations.description,
  workspaceId: baseValidations.workspaceId,
  categoryId: baseValidations.categoryId,
  isTemplate: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  icon: baseValidations.icon
})

// Category (Collection) validation schema
export const createCategorySchema = z.object({
  name: baseValidations.name,
  slug: baseValidations.slug,
  description: baseValidations.shortDescription,
  workspaceId: baseValidations.workspaceId,
  parentId: z.string()
    .regex(uuidRegex, 'Invalid parent category ID')
    .optional(),
  icon: baseValidations.icon,
  color: baseValidations.color
})

// Template validation schema
export const createTemplateSchema = z.object({
  title: baseValidations.title,
  slug: baseValidations.slug,
  description: baseValidations.description
    .refine(val => val && val.length >= 10, 'Templates require a detailed description (at least 10 characters)'),
  workspaceId: baseValidations.workspaceId,
  categoryId: baseValidations.categoryId,
  isPublic: z.boolean().default(true),
  icon: baseValidations.icon,
  templateType: z.enum(['prompt', 'workflow', 'agent']).default('prompt')
})

// Type exports for use in components
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type CreatePromptInput = z.infer<typeof createPromptSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>

// Validation helper functions
export function validateWorkspace(data: unknown) {
  return createWorkspaceSchema.safeParse(data)
}

export function validatePrompt(data: unknown) {
  return createPromptSchema.safeParse(data)
}

export function validateCategory(data: unknown) {
  return createCategorySchema.safeParse(data)
}

export function validateTemplate(data: unknown) {
  return createTemplateSchema.safeParse(data)
}

// Field-specific validation helpers
export function validateSlugFormat(slug: string): boolean {
  return slugRegex.test(slug) && slug.length >= 3
}

export function validateWorkspaceIdFormat(id: string): boolean {
  return uuidRegex.test(id)
}

export function getFieldError(errors: z.ZodError, field: string): string | undefined {
  const fieldError = errors.errors.find(error => 
    error.path.length === 1 && error.path[0] === field
  )
  return fieldError?.message
} 