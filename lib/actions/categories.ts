'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'
import { getWorkspaceCategories, createCategory, updateCategory, deleteCategory } from '@/lib/db/categories'
import { z } from 'zod'

// ==================== INTERFACES ====================

interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface CategoryResponse {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  color?: string | null
  parentId?: string | null
  createdAt: Date
  updatedAt: Date
  promptCount: number
  childrenCount: number
}

interface CreateCategoryInput {
  name: string
  description?: string | null
  icon?: string
  color?: string
  parentId?: string | null
}

interface UpdateCategoryInput {
  name?: string
  description?: string | null
  icon?: string
  color?: string
  parentId?: string | null
}

// ==================== VALIDATION SCHEMAS ====================

const createCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be 50 characters or less')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Category name can only contain letters, numbers, spaces, hyphens, and underscores'),
  description: z.string()
    .max(200, 'Description must be 200 characters or less')
    .optional()
    .nullable(),
  icon: z.string().min(1, 'Icon is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable()
})

const updateCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be 50 characters or less')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Category name can only contain letters, numbers, spaces, hyphens, and underscores')
    .optional(),
  description: z.string()
    .max(200, 'Description must be 200 characters or less')
    .optional()
    .nullable(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable()
})

const slugSchema = z.string()
  .min(3, 'Workspace slug too short')
  .regex(/^[a-z0-9-]+$/, 'Invalid workspace slug format')

// ==================== AUTHENTICATION HELPER ====================

async function getAuthenticatedUser(): Promise<
  | { user: any; error?: never }
  | { user?: never; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { error: 'User not found' }
    }

    return { user }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed' }
  }
}

async function validateWorkspaceAccess(workspaceSlug: string, userId: string) {
  const slugValidation = slugSchema.safeParse(workspaceSlug)
  if (!slugValidation.success) {
    return { error: 'Invalid workspace slug' }
  }

  try {
    const workspace = await getWorkspaceBySlug(workspaceSlug, userId)
    if (!workspace) {
      return { error: 'Workspace not found or access denied' }
    }

    return { workspace, error: undefined }
  } catch (error: any) {
    console.error('Error validating workspace access:', error)
    
    if (error.message.includes('Access denied')) {
      return { error: 'Access denied' }
    }
    
    return { error: 'Internal server error' }
  }
}

function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// ==================== CATEGORY ACTIONS ====================

export async function getWorkspaceCategoriesAction(
  workspaceSlug: string
): Promise<ActionResult<CategoryResponse[]>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) {
      return { success: false, error: validation.error }
    }

    const { workspace } = validation

    if (!workspace) {
      return { success: false, error: 'Workspace not found' }
    }

    // Obtener categorías usando la función de DB
    const categories = await getWorkspaceCategories(workspace.id, user.id)

    // Mapear a la interfaz de respuesta
    const categoriesResponse: CategoryResponse[] = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parentId: category.parentId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      promptCount: category._count.prompts,
      childrenCount: category._count.children
    }))

    return {
      success: true,
      data: categoriesResponse
    }

  } catch (error) {
    console.error('Get categories error:', error)
    return {
      success: false,
      error: 'Failed to fetch categories'
    }
  }
}

export async function createCategoryAction(
  workspaceSlug: string,
  input: CreateCategoryInput
): Promise<ActionResult<{ categoryId: string }>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) {
      return { success: false, error: validation.error }
    }

    const { workspace } = validation

    // Validar con Zod
    const bodyValidation = createCategorySchema.safeParse(input)
    if (!bodyValidation.success) {
      const firstError = bodyValidation.error.errors[0]
      return {
        success: false,
        error: firstError.message
      }
    }

    const validatedData = bodyValidation.data

    // Generar slug
    const slug = generateSlugFromName(validatedData.name)

    // Crear categoría
    const category = await createCategory({
      name: validatedData.name,
      slug,
      description: validatedData.description || undefined,
      icon: validatedData.icon,
      color: validatedData.color,
      parentId: validatedData.parentId || undefined,
      workspaceId: workspace!.id
    }, user.id)

    // Revalidar paths relevantes
    revalidatePath(`/workspaces/${workspaceSlug}`)
    revalidatePath('/dashboard')

    return {
      success: true,
      data: { categoryId: category.id }
    }

  } catch (error) {
    console.error('Create category error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return {
          success: false,
          error: 'A category with this name already exists'
        }
      }
    }
    
    return {
      success: false,
      error: 'Failed to create category'
    }
  }
}

export async function updateCategoryAction(
  workspaceSlug: string,
  categoryId: string,
  input: UpdateCategoryInput
): Promise<ActionResult<void>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) {
      return { success: false, error: validation.error }
    }

    const { workspace } = validation

    // Validar con Zod
    const bodyValidation = updateCategorySchema.safeParse(input)
    if (!bodyValidation.success) {
      const firstError = bodyValidation.error.errors[0]
      return {
        success: false,
        error: firstError.message
      }
    }

    const validatedData = bodyValidation.data

    // Actualizar categoría
    await updateCategory(categoryId, {
      ...validatedData,
      description: validatedData.description || undefined,
      parentId: validatedData.parentId || undefined
    })

    // Revalidar paths relevantes
    revalidatePath(`/workspaces/${workspaceSlug}`)
    revalidatePath('/dashboard')

    return { success: true }

  } catch (error) {
    console.error('Update category error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: 'Category not found'
        }
      }
      
      if (error.message.includes('Access denied')) {
        return {
          success: false,
          error: 'Access denied'
        }
      }
    }
    
    return {
      success: false,
      error: 'Failed to update category'
    }
  }
}

export async function deleteCategoryAction(
  workspaceSlug: string,
  categoryId: string
): Promise<ActionResult<void>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) {
      return { success: false, error: validation.error }
    }

    // Eliminar categoría
    await deleteCategory(categoryId)

    // Revalidar paths relevantes
    revalidatePath(`/workspaces/${workspaceSlug}`)
    revalidatePath('/dashboard')

    return { success: true }

  } catch (error) {
    console.error('Delete category error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: 'Category not found'
        }
      }
      
      if (error.message.includes('Access denied')) {
        return {
          success: false,
          error: 'Access denied'
        }
      }
      
      if (error.message.includes('has prompts')) {
        return {
          success: false,
          error: 'Cannot delete category that contains prompts'
        }
      }
    }
    
    return {
      success: false,
      error: 'Failed to delete category'
    }
  }
} 