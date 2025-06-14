import { z } from 'zod'

// ==================== TEMPLATE SCHEMAS ====================

export const createTemplateSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  workspaceId: z.string()
    .min(1, 'Workspace is required'),
  categoryId: z.string().optional(),
  isPublic: z.boolean().default(true),
  icon: z.string().optional(),
  templateType: z.enum(['prompt', 'workflow', 'agent']).default('prompt')
})

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>

// ==================== PROMPT SCHEMAS ====================

export const createPromptSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  workspaceId: z.string()
    .min(1, 'Workspace is required'),
  categoryId: z.string().optional(),
  isTemplate: z.boolean().default(false),
  isPublic: z.boolean().default(false)
})

export type CreatePromptInput = z.infer<typeof createPromptSchema>

// ==================== PROFILE SCHEMAS ====================

export const updateProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .optional()
    .nullable(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .optional()
    .nullable(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable()
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// ==================== UTILITY FUNCTIONS ====================

export function getFieldError(error: z.ZodError, field: string): string | undefined {
  const fieldError = error.errors.find(err => 
    err.path.length > 0 && err.path[0] === field
  )
  return fieldError?.message
}

// ==================== WORKSPACE SCHEMAS ====================

export const createWorkspaceSchema = z.object({
  name: z.string()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(50, 'Workspace name must be less than 50 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(30, 'Slug must be less than 30 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>

// ==================== CATEGORY SCHEMAS ====================

export const createCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(30, 'Category name must be less than 30 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  workspaceId: z.string()
    .min(1, 'Workspace is required'),
  parentId: z.string().optional()
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema> 