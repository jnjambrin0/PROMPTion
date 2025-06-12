import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId, updateUser } from '@/lib/db/users'
import { z } from 'zod'

// ==================== TIPOS Y ESQUEMAS ====================

interface ProfileResponse {
  id: string
  email: string
  username?: string | null
  fullName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

interface UpdateProfileRequest {
  fullName?: string | null
  username?: string | null
  bio?: string | null
}

// Esquema de validación con Zod
const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long').optional().nullable(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .optional()
    .nullable(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable()
})

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

// ==================== HANDLERS ====================

export async function GET() {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth

    // Mapear a la interfaz de respuesta
    const profileResponse: ProfileResponse = {
      id: user.id,
      email: user.email,
      username: user.username || undefined,
      fullName: user.fullName || undefined,
      bio: user.bio || undefined,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return NextResponse.json(profileResponse)

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth

    // Parse y validar request body
    let body: UpdateProfileRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validar con Zod
    const validation = updateProfileSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Actualizar perfil de usuario
    const updatedUser = await updateUser(user.id, {
      fullName: validatedData.fullName ?? undefined,
      username: validatedData.username ?? undefined,
      bio: validatedData.bio ?? undefined
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Mapear a la interfaz de respuesta
    const profileResponse: ProfileResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username || undefined,
      fullName: updatedUser.fullName || undefined,
      bio: updatedUser.bio || undefined,
      avatarUrl: updatedUser.avatarUrl || undefined,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }

    // Headers de seguridad
    const response = NextResponse.json({
      success: true,
      user: profileResponse
    })
    response.headers.set('X-Content-Type-Options', 'nosniff')

    return response

  } catch (error) {
    console.error('Profile update error:', error)
    
    // Manejo específico de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 