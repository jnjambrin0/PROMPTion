import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { z } from 'zod'

import type { JsonValue } from '@/lib/types/shared'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

// ==================== TIPOS Y ESQUEMAS ====================

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

interface BlockContentData {
  text?: string
  level?: number
  language?: string
  variable?: {
    name: string
    type: 'string' | 'number' | 'boolean' | 'select'
    description: string
    required: boolean
    defaultValue?: string
    options?: string[]
  }
}

interface PromptBlock {
  id: string
  type: string
  content: BlockContentData
  position: number
  indentLevel: number
  createdAt: Date
}

interface PromptVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  description: string
  required: boolean
  defaultValue?: string
  options?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  modelConfig: Record<string, JsonValue>
  variables: PromptVariable[]
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
  modelConfig: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  variables: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'boolean', 'select']),
    description: z.string(),
    required: z.boolean(),
    defaultValue: z.string().optional(),
    options: z.array(z.string()).optional()
  })).optional()
})

// Esquemas de validación para parámetros
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

async function validateWorkspaceAndPrompt(
  workspaceSlug: string,
  promptSlug: string,
  user: { id: string }
) {
  try {
    // Get workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        members: {
          some: {
            userId: user.id
          }
        }
      }
    })

    if (!workspace) {
      return { error: NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 }) }
    }

    // Get prompt
    const prompt = await prisma.prompt.findFirst({
      where: {
        slug: promptSlug,
        workspaceId: workspace.id
      },
      include: {
        blocks: true,
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    })

    if (!prompt) {
      return { error: NextResponse.json({ error: 'Prompt not found' }, { status: 404 }) }
    }

    return { workspace, prompt, error: undefined }
  } catch (error: unknown) {
    console.error('Error validating workspace and prompt:', error)
    return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) }
  }
}

// ==================== HANDLERS ====================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceSlug: string; promptSlug: string }> }
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth
    const { workspaceSlug, promptSlug } = await params

    const validation = await validateWorkspaceAndPrompt(workspaceSlug, promptSlug, user)
    if (validation.error) return validation.error

    const { prompt } = validation

    return NextResponse.json(prompt)

  } catch (error: unknown) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceSlug: string; promptSlug: string }> }
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth
    const { workspaceSlug, promptSlug } = await params

    const validation = await validateWorkspaceAndPrompt(workspaceSlug, promptSlug, user)
    if (validation.error) return validation.error

    const { prompt } = validation

    // Check if user can edit this prompt
    const canEdit = prompt.userId === user.id || 
                   // TODO: Check if user is admin/editor of workspace
                   false

    if (!canEdit) {
      return NextResponse.json(
        { error: 'No permission to edit this prompt' },
        { status: 403 }
      )
    }

    // Parse request body
    let requestBody: Record<string, JsonValue>
    try {
      requestBody = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate with Zod
    const validationResult = updatePromptSchema.safeParse(requestBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    // Update prompt
    const updatedPrompt = await prisma.prompt.update({
      where: { id: prompt.id },
      data: {
        ...validationResult.data,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedPrompt)

  } catch (error: unknown) {
    console.error('Error updating prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceSlug: string; promptSlug: string }> }
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth
    const { workspaceSlug, promptSlug } = await params

    const validation = await validateWorkspaceAndPrompt(workspaceSlug, promptSlug, user)
    if (validation.error) return validation.error

    const { prompt } = validation

    // Check if user can delete this prompt
    const canDelete = prompt.userId === user.id || 
                     // TODO: Check if user is admin/owner of workspace
                     false

    if (!canDelete) {
      return NextResponse.json(
        { error: 'No permission to delete this prompt' },
        { status: 403 }
      )
    }

    // Delete prompt (this will cascade delete blocks)
    await prisma.prompt.delete({
      where: { id: prompt.id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Prompt deleted successfully' 
    })

  } catch (error: unknown) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 