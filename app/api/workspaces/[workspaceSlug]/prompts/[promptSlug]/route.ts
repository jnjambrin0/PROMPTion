import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'
import { getPromptBySlug, updatePrompt } from '@/lib/db/prompts'
import { z } from 'zod'

// ==================== TIPOS Y ESQUEMAS ====================

interface PromptParams {
  params: Promise<{
    workspaceSlug: string
    promptSlug: string
  }>
}

interface PromptUser {
  id: string
  username?: string | null
  fullName?: string | null
  avatarUrl?: string | null
}

interface PromptWorkspace {
  id: string
  name: string
  slug: string
}

interface PromptCategory {
  id: string
  name: string
  color?: string | null
  icon?: string | null
}

interface PromptBlock {
  id: string
  type: string
  content: any
  position: number
  indentLevel: number
  createdAt: Date
}

interface PromptResponse {
  id: string
  title: string
  slug: string
  description?: string | null
  icon?: string | null
  isTemplate: boolean
  isPublic: boolean
  isPinned: boolean
  aiModel?: string | null
  modelConfig: any
  variables: any
  viewCount: number
  useCount: number
  forkCount: number
  averageScore?: number | null
  currentVersion: number
  createdAt: Date
  updatedAt: Date
  lastUsedAt?: Date | null
  user: PromptUser
  workspace: PromptWorkspace
  category?: PromptCategory | null
  blocks: PromptBlock[]
  stats: {
    comments: number
    favorites: number
    forks: number
  }
}

// Esquema de validación para updates
const updatePromptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long').optional(),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
  isTemplate: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  aiModel: z.string().max(50).optional().nullable(),
  modelConfig: z.record(z.any()).optional(),
  variables: z.array(z.any()).optional()
})

// Esquemas de validación para parámetros
const slugSchema = z.string().min(3, 'Slug too short').regex(/^[a-z0-9-]+$/, 'Invalid slug format')

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

async function validateAndGetWorkspacePrompt(
  workspaceSlug: string, 
  promptSlug: string, 
  userId: string
) {
  // Validar slugs
  const workspaceValidation = slugSchema.safeParse(workspaceSlug)
  const promptValidation = slugSchema.safeParse(promptSlug)

  if (!workspaceValidation.success) {
    return { error: NextResponse.json({ error: 'Invalid workspace slug' }, { status: 400 }) }
  }

  if (!promptValidation.success) {
    return { error: NextResponse.json({ error: 'Invalid prompt slug' }, { status: 400 }) }
  }

  try {
    // Obtener workspace
    const workspace = await getWorkspaceBySlug(workspaceSlug, userId)
    if (!workspace) {
      return { error: NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 }) }
    }

    // Obtener prompt
    const prompt = await getPromptBySlug(promptSlug, workspace.id, userId)
    if (!prompt) {
      return { error: NextResponse.json({ error: 'Prompt not found or access denied' }, { status: 404 }) }
    }

    return { workspace, prompt, error: undefined }
  } catch (error: any) {
    console.error('Error validating workspace/prompt:', error)
    
    if (error.message.includes('Access denied')) {
      return { error: NextResponse.json({ error: 'Access denied' }, { status: 403 }) }
    }
    
    return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
  }
}

// ==================== HANDLERS ====================

export async function GET(
  request: NextRequest,
  { params }: PromptParams
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth
    const { workspaceSlug, promptSlug } = await params

    const validation = await validateAndGetWorkspacePrompt(
      workspaceSlug, 
      promptSlug, 
      user.id
    )

    if (validation.error) return validation.error

    const { workspace, prompt } = validation

    // Mapear a la interfaz de respuesta
    const promptResponse: PromptResponse = {
      id: prompt.id,
      title: prompt.title,
      slug: prompt.slug,
      description: prompt.description,
      icon: prompt.icon,
      isTemplate: prompt.isTemplate,
      isPublic: prompt.isPublic,
      isPinned: prompt.isPinned,
      aiModel: prompt.aiModel,
      modelConfig: prompt.modelConfig,
      variables: prompt.variables,
      viewCount: prompt.viewCount,
      useCount: prompt.useCount,
      forkCount: prompt.forkCount,
      averageScore: prompt.averageScore,
      currentVersion: prompt.currentVersion,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
      lastUsedAt: prompt.lastUsedAt,
      user: {
        id: prompt.user.id,
        username: prompt.user.username,
        fullName: prompt.user.fullName,
        avatarUrl: prompt.user.avatarUrl
      },
      workspace: {
        id: prompt.workspace.id,
        name: prompt.workspace.name,
        slug: prompt.workspace.slug
      },
      category: prompt.category ? {
        id: prompt.category.id,
        name: prompt.category.name,
        color: prompt.category.color,
        icon: prompt.category.icon
      } : null,
      blocks: prompt.blocks.map(block => ({
        id: block.id,
        type: block.type,
        content: block.content,
        position: block.position,
        indentLevel: block.indentLevel,
        createdAt: block.createdAt
      })),
      stats: {
        comments: prompt._count.comments,
        favorites: prompt._count.favorites,
        forks: prompt._count.forks
      }
    }

    // Headers de cache para datos de prompt
    const response = NextResponse.json({
      success: true,
      prompt: promptResponse
    })
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'private, max-age=60') // Cache por 1 minuto
    
    return response

  } catch (error) {
    console.error('Get prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: PromptParams
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth
    const { workspaceSlug, promptSlug } = await params

    const validation = await validateAndGetWorkspacePrompt(
      workspaceSlug, 
      promptSlug, 
      user.id
    )

    if (validation.error) return validation.error

    const { workspace, prompt } = validation

    // Parse y validar request body
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validar con Zod
    const bodyValidation = updatePromptSchema.safeParse(body)
    if (!bodyValidation.success) {
      const firstError = bodyValidation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const validatedData = bodyValidation.data

    // Verificar permisos de edición
    const canEdit = prompt.userId === user.id || 
                   workspace.ownerId === user.id ||
                   // TODO: Verificar si es admin/editor del workspace
                   false

    if (!canEdit) {
      return NextResponse.json(
        { error: 'No permission to edit this prompt' },
        { status: 403 }
      )
    }

    // Actualizar prompt
    const updateData = {
      title: validatedData.title,
      description: validatedData.description ?? undefined,
      categoryId: validatedData.categoryId ?? undefined,
      isTemplate: validatedData.isTemplate,
      isPublic: validatedData.isPublic,
      isPinned: validatedData.isPinned
    }

    const updatedPrompt = await updatePrompt(prompt.id, updateData, user.id)

    const response = NextResponse.json({
      success: true,
      message: 'Prompt updated successfully',
      prompt: {
        id: updatedPrompt.id,
        title: updatedPrompt.title,
        slug: updatedPrompt.slug,
        description: updatedPrompt.description,
        isTemplate: updatedPrompt.isTemplate,
        isPublic: updatedPrompt.isPublic,
        isPinned: updatedPrompt.isPinned,
        updatedAt: updatedPrompt.updatedAt
      }
    })

    // Headers de seguridad
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    return response

  } catch (error: any) {
    console.error('Update prompt error:', error)
    
    // Manejar errores específicos
    if (error.message.includes('access denied')) {
      return NextResponse.json(
        { error: 'No permission to edit this prompt' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 