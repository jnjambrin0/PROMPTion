import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'
import { getWorkspaceCategories, createCategory } from '@/lib/db/categories'
import { z } from 'zod'

// ==================== TIPOS Y ESQUEMAS ====================

interface CategoryParams {
  params: Promise<{
    workspaceSlug: string
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

interface CreateCategoryRequest {
  name: string
  description?: string
  icon?: string
  color?: string
  parentId?: string
}

// Esquema de validación con Zod
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

// Esquema de validación para slug
const slugSchema = z.string()
  .min(3, 'Workspace slug too short')
  .regex(/^[a-z0-9-]+$/, 'Invalid workspace slug format')

// ==================== UTILIDADES ====================

async function authenticateUser() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }) }
  }

  return { user, authUser, error: undefined }
}

async function validateWorkspaceAccess(workspaceSlug: string, userId: string) {
  // Validar slug del workspace
  const slugValidation = slugSchema.safeParse(workspaceSlug)
  if (!slugValidation.success) {
    return { error: NextResponse.json({ error: 'Invalid workspace slug' }, { status: 400 }) }
  }

  try {
    const workspace = await getWorkspaceBySlug(workspaceSlug, userId)
    if (!workspace) {
      return { error: NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 }) }
    }

    return { workspace, error: undefined }
  } catch (error: any) {
    console.error('Error validating workspace access:', error)
    
    if (error.message.includes('Access denied')) {
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
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth
    const { workspaceSlug } = await params

    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) return validation.error

    const { workspace } = validation

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

    // Headers de cache para datos de categorías
    const response = NextResponse.json({
      success: true,
      categories: categoriesResponse
    })
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'private, max-age=60') // Cache por 1 minuto
    
    return response

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: CategoryParams
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth
    const { workspaceSlug } = await params

    const validation = await validateWorkspaceAccess(workspaceSlug, user.id)
    if (validation.error) return validation.error

    const { workspace } = validation

    // Parse y validar request body
    let body: CreateCategoryRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validar con Zod
    const bodyValidation = createCategorySchema.safeParse(body)
    if (!bodyValidation.success) {
      const firstError = bodyValidation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const validatedData = bodyValidation.data

    // Generar slug a partir del nombre
    const slug = generateSlugFromName(validatedData.name)
    if (!slug || slug.length < 2) {
      return NextResponse.json(
        { error: 'Category name must generate a valid slug' },
        { status: 400 }
      )
    }

    // Crear categoría usando la función de DB
    const categoryData = {
      name: validatedData.name,
      slug: slug,
      description: validatedData.description || undefined,
      workspaceId: workspace.id,
      parentId: validatedData.parentId || undefined,
      icon: validatedData.icon || '📋',
      color: validatedData.color || 'gray'
    }

    const category = await createCategory(categoryData, user.id)

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
      promptCount: category._count.prompts,
      childrenCount: category._count.children
    }

    // Headers de seguridad
    const response = NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: categoryResponse
    }, { status: 201 })
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    return response

  } catch (error: any) {
    console.error('Create category error:', error)
    
    // Manejar errores específicos
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.message.includes('access denied')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create categories' },
        { status: 403 }
      )
    }
    
    if (error.message.includes('slug already exists')) {
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