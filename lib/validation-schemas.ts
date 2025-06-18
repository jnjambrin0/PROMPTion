import { z } from 'zod'

// Import CategoryColor from the color picker component
const categoryColors = ['gray', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo'] as const

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
  color: z.enum(categoryColors).optional(),
  workspaceId: z.string()
    .min(1, 'Workspace is required'),
  parentId: z.string().optional()
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

/**
 * Validation schemas for authentication forms
 * These schemas are shared between frontend and backend for consistency
 */

// Password validation schema with security requirements
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// Email validation schema
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')

// Sign up form validation schema
export const signUpFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the Terms and Conditions' }),
    }),
    marketingConsent: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// Sign in form validation schema
export const signInFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Password strength checker for real-time feedback
export const getPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  }

  const passedChecks = Object.values(checks).filter(Boolean).length
  const strength = passedChecks / 5

  return {
    checks,
    strength,
    score: Math.round(strength * 100),
    level: 
      strength >= 1 ? 'strong' :
      strength >= 0.8 ? 'good' :
      strength >= 0.6 ? 'fair' :
      strength >= 0.4 ? 'weak' : 'very-weak'
  }
}

export type SignUpFormData = z.infer<typeof signUpFormSchema>
export type SignInFormData = z.infer<typeof signInFormSchema> 