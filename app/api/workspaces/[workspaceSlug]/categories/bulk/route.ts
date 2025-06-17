import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/actions/auth/auth-helpers'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'
import { updateCategory, deleteCategory, getCategoriesByWorkspace } from '@/lib/db/categories'
import { z } from 'zod'

// ==================== TIPOS Y ESQUEMAS ====================

interface BulkParams {
  params: Promise<{
    workspaceSlug: string
  }>
}

// Esquemas de validación
const bulkUpdateSchema = z.object({
  categoryIds: z.array(z.string().uuid('Invalid category ID')).min(1, 'At least one category ID is required'),
  updates: z.object({
    description: z.string().max(200, 'Description too long').optional(),
    color: z.string().max(50, 'Color name too long').optional(),
    icon: z.string().max(10, 'Icon too long').optional()
  }).refine(data => Object.keys(data).length > 0, 'At least one field to update is required')
})

const bulkDeleteSchema = z.object({
  categoryIds: z.array(z.string().uuid('Invalid category ID')).min(1, 'At least one category ID is required')
})

const slugSchema = z.string().min(3, 'Slug too short').regex(/^[a-z0-9-]+$/, 'Invalid slug format')

// ==================== UTILIDADES ====================

async function validateWorkspaceAccess(workspaceSlug: string, userId: string) {
  // Validar slug
  const slugValidation = slugSchema.safeParse(workspaceSlug)
  if (!slugValidation.success) {
    return { error: NextResponse.json({ error: 'Invalid workspace slug' }, { status: 400 }) }
  }

  try {
    // Obtener workspace y verificar acceso
    const workspace = await getWorkspaceBySlug(workspaceSlug, userId)
    if (!workspace) {
      return { error: NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 }) }
    }

    // Obtener categorías del workspace
    const categories = await getCategoriesByWorkspace(workspaceSlug)
    if (!categories) {
      return { error: NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 }) }
    }

    return { workspace, categories, error: undefined }
  } catch (error: unknown) {
    console.error('Error validating workspace access:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return { error: NextResponse.json({ error: 'Access denied' }, { status: 403 }) }
    }
    
    return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
  }
}

// ==================== HANDLERS ====================

// PATCH /api/workspaces/[workspaceSlug]/categories/bulk - Bulk update categories
export async function PATCH(
  request: NextRequest,
  { params }: BulkParams
) {
  try {
    // Autenticación
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { workspaceSlug } = await params

    // Validar acceso al workspace
    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) return validation.error

    const { workspace, categories } = validation

    // Parsear y validar request body
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validar con Zod
    const bodyValidation = bulkUpdateSchema.safeParse(body)
    if (!bodyValidation.success) {
      const firstError = bodyValidation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const { categoryIds, updates } = bodyValidation.data

    // Verificar permisos de edición
    const canEdit = workspace.ownerId === user.id ||
                   // TODO: Verificar si es admin/editor del workspace
                   false

    if (!canEdit) {
      return NextResponse.json(
        { error: 'No permission to edit categories in this workspace' },
        { status: 403 }
      )
    }

    // Filtrar categorías válidas (que existen en el workspace y no son default)
    const validCategoryIds = categories
      .filter(cat => categoryIds.includes(cat.id) && !cat.isDefault)
      .map(cat => cat.id)

    if (validCategoryIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid categories found to update' },
        { status: 400 }
      )
    }

    // Realizar actualización masiva
    let updatedCount = 0
    const errors: string[] = []

    for (const categoryId of validCategoryIds) {
      try {
        const result = await updateCategory(categoryId, updates)
        if (result) {
          updatedCount++
        }
      } catch (error) {
        console.error(`Failed to update category ${categoryId}:`, error)
        errors.push(`Failed to update category ${categoryId}`)
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Bulk update completed',
      updatedCount,
      requestedCount: categoryIds.length,
      validCount: validCategoryIds.length,
      errors: errors.length > 0 ? errors : undefined
    })

    // Headers de seguridad
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response

  } catch (error) {
    console.error('Bulk update categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workspaces/[workspaceSlug]/categories/bulk - Bulk delete categories
export async function DELETE(
  request: NextRequest,
  { params }: BulkParams
) {
  try {
    // Autenticación
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { workspaceSlug } = await params

    // Validar acceso al workspace
    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) return validation.error

    const { workspace, categories } = validation

    // Parsear y validar request body
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validar con Zod
    const bodyValidation = bulkDeleteSchema.safeParse(body)
    if (!bodyValidation.success) {
      const firstError = bodyValidation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const { categoryIds } = bodyValidation.data

    // Verificar permisos de eliminación
    const canDelete = workspace.ownerId === user.id ||
                     // TODO: Verificar si es admin del workspace
                     false

    if (!canDelete) {
      return NextResponse.json(
        { error: 'No permission to delete categories in this workspace' },
        { status: 403 }
      )
    }

    // Filtrar categorías válidas (que existen en el workspace y no son default)
    const validCategoryIds = categories
      .filter(cat => categoryIds.includes(cat.id) && !cat.isDefault)
      .map(cat => cat.id)

    if (validCategoryIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid categories found to delete' },
        { status: 400 }
      )
    }

    // Realizar eliminación masiva
    let deletedCount = 0
    const errors: string[] = []

    for (const categoryId of validCategoryIds) {
      try {
        const result = await deleteCategory(categoryId)
        if (result) {
          deletedCount++
        }
      } catch (error) {
        console.error(`Failed to delete category ${categoryId}:`, error)
        errors.push(`Failed to delete category ${categoryId}`)
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Bulk delete completed',
      deletedCount,
      requestedCount: categoryIds.length,
      validCount: validCategoryIds.length,
      errors: errors.length > 0 ? errors : undefined
    })

    // Headers de seguridad
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response

  } catch (error) {
    console.error('Bulk delete categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 