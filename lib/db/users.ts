import prisma from '../prisma'
import type { User } from '../generated/prisma'

/**
 * Obtiene un usuario por ID de forma segura
 * @param id - UUID del usuario
 * @returns Usuario sin datos sensibles
 */
export async function getUserById(id: string): Promise<Omit<User, 'authId'> | null> {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid user ID')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        emailVerified: true,
        isActive: true,
        lastActiveAt: true,
        createdAt: true,
        updatedAt: true,
        // Excluimos authId por seguridad
      }
    })
    
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }
}

/**
 * Obtiene un usuario por authId (solo para autenticación interna)
 * @param authId - ID de Supabase Auth
 * @returns Usuario completo para operaciones internas
 */
export async function getUserByAuthId(authId: string): Promise<User | null> {
  if (!authId || typeof authId !== 'string') {
    throw new Error('Invalid auth ID')
  }

  try {
    return await prisma.user.findUnique({
      where: { authId }
    })
  } catch (error) {
    console.error('Error fetching user by authId:', error)
    throw new Error('Failed to fetch user')
  }
}

/**
 * Actualiza datos del usuario de forma segura
 * @param id - ID del usuario
 * @param data - Datos a actualizar (solo campos permitidos)
 * @returns Usuario actualizado
 */
export async function updateUser(
  id: string,
  data: {
    username?: string
    fullName?: string
    bio?: string
    avatarUrl?: string
  }
): Promise<Omit<User, 'authId'> | null> {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid user ID')
  }

  // Validar datos de entrada
  if (data.username && (typeof data.username !== 'string' || data.username.length < 3)) {
    throw new Error('Username must be at least 3 characters')
  }

  if (data.bio && data.bio.length > 500) {
    throw new Error('Bio must be less than 500 characters')
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        emailVerified: true,
        isActive: true,
        lastActiveAt: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Failed to update user')
  }
}

/**
 * Obtiene un usuario por email (para verificar existencia en invitaciones)
 * @param email - Email del usuario
 * @returns Usuario básico sin datos sensibles
 */
export async function getUserByEmail(email: string): Promise<Omit<User, 'authId'> | null> {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        emailVerified: true,
        isActive: true,
        lastActiveAt: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    
    return user
  } catch (error) {
    console.error('Error fetching user by email:', error)
    throw new Error('Failed to fetch user')
  }
}

/**
 * Actualiza la última actividad del usuario
 * @param id - ID del usuario
 */
export async function updateLastActivity(id: string): Promise<void> {
  if (!id || typeof id !== 'string') {
    return // Falla silenciosa para no afectar la UX
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { lastActiveAt: new Date() }
    })
  } catch (error) {
    // Log pero no lanzar error - no es crítico
    console.error('Error updating last activity:', error)
  }
} 