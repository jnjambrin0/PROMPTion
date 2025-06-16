'use server'

import { revalidatePath } from 'next/cache'
import { withAuth } from '@/lib/actions/auth/auth-helpers'
import prisma from '@/lib/prisma'
import type { AuthenticatedUser } from '@/lib/types/shared'

interface FavoriteResult {
  success: boolean
  error?: string
  isFavorited?: boolean
}

/**
 * Toggle favorite status for a prompt
 */
export const toggleFavoritePromptAction = withAuth(async (
  user: AuthenticatedUser,
  promptId: string
): Promise<FavoriteResult> => {
  try {
    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: promptId
        }
      }
    })

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          userId_promptId: {
            userId: user.id,
            promptId: promptId
          }
        }
      })

      // Revalidate paths
      revalidatePath('/dashboard')
      revalidatePath('/favorites')

      return {
        success: true,
        isFavorited: false
      }
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId: user.id,
          promptId: promptId
        }
      })

      // Revalidate paths
      revalidatePath('/dashboard')
      revalidatePath('/favorites')

      return {
        success: true,
        isFavorited: true
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { success: false, error: 'Failed to update favorite status' }
  }
})

/**
 * Check if a prompt is favorited by the user
 */
export const checkPromptFavoriteAction = withAuth(async (
  user: AuthenticatedUser,
  promptId: string
): Promise<FavoriteResult> => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: promptId
        }
      }
    })

    return {
      success: true,
      isFavorited: !!favorite
    }
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return { success: false, error: 'Failed to check favorite status' }
  }
}) 