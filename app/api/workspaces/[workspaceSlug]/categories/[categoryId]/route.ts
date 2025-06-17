import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/actions/auth/auth-helpers'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'
import { getCategoryById } from '@/lib/db/categories'
import prisma from '@/lib/prisma'
import { z } from 'zod'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DetailedError } from '@/lib/types/shared'


// ==================== TIPOS Y ESQUEMAS ====================

interface CategoryParams {
  params: Promise<{
    workspaceSlug: string
    categoryId: string
  }>
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

interface UpdateCategoryRequest {
  name?: string
  description?: string
  icon?: string
  color?: string
  parentId?: string
}

// Esquema de validación para actualización
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
  icon: z.string().min(1, 'Icon is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable()
})

// Esquemas de validación para parámetros
const slugSchema = z.string()
  .min(3, 'Workspace slug too short')
  .regex(/^[a-z0-9-]+$/, 'Invalid workspace slug format')

const uuidSchema = z.string().uuid('Invalid category ID')

// ==================== UTILIDADES ====================

async function validateWorkspaceAndCategory(
  workspaceSlug: string, 
  categoryId: string, 
  userId: string
) {
  // Validar parámetros
  const slugValidation = slugSchema.safeParse(workspaceSlug)
  const categoryValidation = uuidSchema.safeParse(categoryId)

  if (!slugValidation.success) {
    return { error: NextResponse.json({ error: 'Invalid workspace slug' }, { status: 400 }) }
  }

  if (!categoryValidation.success) {
    return { error: NextResponse.json({ error: 'Invalid category ID' }, { status: 400 }) }
  }

  try {
    // Obtener workspace y verificar acceso
    const workspace = await getWorkspaceBySlug(workspaceSlug, userId)
    if (!workspace) {
      return { error: NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 }) }
    }

    // Obtener categoría y verificar que pertenece al workspace
    const category = await getCategoryById(categoryId, userId)
    if (!category) {
      return { error: NextResponse.json({ error: 'Category not found or access denied' }, { status: 404 }) }
    }

    // Verificar que la categoría pertenece al workspace
    if (category.workspaceId !== workspace.id) {
      return { error: NextResponse.json({ error: 'Category does not belong to this workspace' }, { status: 404 }) }
    }

    return { workspace, category, error: undefined }
  } catch (error: DetailedError | unknown) {
    console.error('Error validating workspace/category:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('Access denied')) {
      return { error: NextResponse.json({ error: 'Access denied' }, { status: 403 }) }
    }
    
    return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
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

// ==================== HANDLERS ====================

export async function GET(
  request: NextRequest,
  { params }: CategoryParams
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { workspaceSlug, categoryId } = await params

    const validation = await validateWorkspaceAndCategory(
      workspaceSlug, 
      categoryId, 
      user.id
    )

    if (validation.error) return validation.error

    const { category } = validation

    // Mapear a la interfaz de respuesta
    const categoryResponse: CategoryResponse = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parentId: category.parentId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      promptCount: category._count?.prompts || 0,
      childrenCount: category._count?.children || 0
    }

    // Headers de cache
    const response = NextResponse.json({
      success: true,
      category: categoryResponse
    })
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'private, max-age=60')
    
    return response

  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: CategoryParams
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { workspaceSlug, categoryId } = await params

    const validation = await validateWorkspaceAndCategory(
      workspaceSlug, 
      categoryId, 
      user.id
    )

    if (validation.error) return validation.error

    // Parse y validar request body
    let body: UpdateCategoryRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validar con Zod
    const bodyValidation = updateCategorySchema.safeParse(body)
    if (!bodyValidation.success) {
      const firstError = bodyValidation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const validatedData = bodyValidation.data

    // Preparar datos de actualización
    const updateData: Partial<{
      name: string
      slug: string
      description: string | null
      icon: string | null
      color: string | null
      parentId: string | null
    }> = {}
    
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name
      updateData.slug = generateSlugFromName(validatedData.name)
    }
    
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description
    }
    
    if (validatedData.icon !== undefined) {
      updateData.icon = validatedData.icon
    }
    
    if (validatedData.color !== undefined) {
      updateData.color = validatedData.color
    }
    
    if (validatedData.parentId !== undefined) {
      updateData.parentId = validatedData.parentId
    }

    // Actualizar categoría
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        _count: {
          select: {
            prompts: true,
            children: true
          }
        }
      }
    })

    const categoryResponse: CategoryResponse = {
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      description: updatedCategory.description,
      icon: updatedCategory.icon,
      color: updatedCategory.color,
      parentId: updatedCategory.parentId,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
      promptCount: updatedCategory._count?.prompts || 0,
      childrenCount: updatedCategory._count?.children || 0
    }

    // Headers de seguridad
    const response = NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: categoryResponse
    })
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    return response

  } catch (error: DetailedError | unknown) {
    console.error('Update category error:', error)
    
    // Manejar errores específicos
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('access denied')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update this category' },
        { status: 403 }
      )
    }
    
    if (errorMessage.includes('slug already exists')) {
      return NextResponse.json(
        { error: 'A category with this name already exists in the workspace' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: CategoryParams
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { workspaceSlug, categoryId } = await params

    const validation = await validateWorkspaceAndCategory(
      workspaceSlug,
      categoryId,
      user.id
    )

    if (validation.error) return validation.error

    const { category } = validation

    // Verificar si la categoría tiene subcategorías o prompts
    const hasChildren = await prisma.category.count({ where: { parentId: category.id } })
    const hasPrompts = await prisma.prompt.count({ where: { categoryId: category.id } })

    if (hasChildren > 0) {
      return NextResponse.json(
        { error: 'Cannot delete a category that has sub-categories.' },
        { status: 400 }
      )
    }

    if (hasPrompts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete a category that contains prompts.' },
        { status: 400 }
      )
    }

    // Eliminar la categoría
    await prisma.category.delete({
      where: { id: category.id },
    })

    return NextResponse.json({ success: true, message: 'Category deleted successfully' })

  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 