'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId, updateUser } from '@/lib/db/users'
import { z } from 'zod'
import type { ActionResult, AuthenticatedUser } from '@/lib/types/shared'

// ==================== INTERFACES ====================

interface ProfileData {
  id: string
  email: string
  username?: string | null
  fullName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

// ==================== VALIDATION SCHEMAS ====================

const updateProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .optional()
    .nullable(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .optional()
    .nullable(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable()
})

// ==================== AUTHENTICATION HELPER ====================

async function getAuthenticatedUser(): Promise<
  | { user: AuthenticatedUser; error?: never }
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

// ==================== PROFILE ACTIONS ====================

export async function getProfileAction(): Promise<ActionResult<ProfileData>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error || !auth.user) {
      return { success: false, error: auth.error || 'Authentication required' }
    }

    const user = auth.user

    // Mapear a la interfaz de respuesta
    const profileData: ProfileData = {
      id: user.id,
      email: user.email,
      username: user.username || null,
      fullName: user.fullName || null,
      bio: user.bio || null,
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return {
      success: true,
      data: profileData
    }

  } catch (error) {
    console.error('Profile fetch error:', error)
    return {
      success: false,
      error: 'Failed to fetch profile'
    }
  }
}

export async function updateProfileAction(
  input: {
    fullName?: string | null
    username?: string | null
    bio?: string | null
  }
): Promise<ActionResult<ProfileData>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error || !auth.user) {
      return { success: false, error: auth.error || 'Authentication required' }
    }

    const user = auth.user

    // Validar con Zod
    const validation = updateProfileSchema.safeParse(input)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: firstError.message
      }
    }

    const validatedData = validation.data

    // Actualizar perfil de usuario
    const updatedUser = await updateUser(user.id, {
      fullName: validatedData.fullName ?? undefined,
      username: validatedData.username ?? undefined,
      bio: validatedData.bio ?? undefined
    })

    if (!updatedUser) {
      return {
        success: false,
        error: 'Failed to update profile'
      }
    }

    // Revalidar paths relevantes
    revalidatePath('/profile')
    revalidatePath('/dashboard')

    // Mapear a la interfaz de respuesta
    const profileData: ProfileData = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username || null,
      fullName: updatedUser.fullName || null,
      bio: updatedUser.bio || null,
      avatarUrl: updatedUser.avatarUrl || null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }

    return {
      success: true,
      data: profileData
    }

  } catch (error) {
    console.error('Profile update error:', error)
    
    // Manejo específico de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'Username already exists'
        }
      }
    }
    
    return {
      success: false,
      error: 'Failed to update profile'
    }
  }
} 