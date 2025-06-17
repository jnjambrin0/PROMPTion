import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { AuthenticatedUser } from '@/lib/types/shared'

/**
 * Retrieves the full authenticated user state. This is the centralized,
 * canonical way to check for a user's session across the app.
 *
 * It gracefully handles the replication lag that can occur after signup
 * by constructing a partial `AuthenticatedUser` object from the Supabase
 * session data if the full profile from the public `users` table is not yet available.
 * This prevents redirection loops.
 *
 * @returns An `AuthenticatedUser` object if a session exists, otherwise `null`.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return null
    }

    const profile = await getUserByAuthId(authUser.id)

    // If the profile exists in our DB, return the full, merged user object.
    if (profile) {
      return profile
    }

    // HANDLE RACE CONDITION:
    // If the profile is not yet in our DB (due to replication lag),
    // we construct a partial but valid AuthenticatedUser from the auth data.
    // This acknowledges the user is logged in and prevents sign-in loops.
    // The application should handle this partial state gracefully.
    console.warn(
      `[AUTH] User profile not found for authId: ${authUser.id}. Serving partial user state.`
    )

    return {
      id: authUser.id, // Use authUser.id as the primary ID temporarily
      authId: authUser.id,
      email: authUser.email || '',
      emailVerified: !!authUser.email_confirmed_at,
      username: authUser.user_metadata.username || null,
      fullName: authUser.user_metadata.full_name || null,
      avatarUrl: authUser.user_metadata.avatar_url || null,
      bio: null,
      isActive: true, // Assume active if they have a session
      lastActiveAt: new Date(),
      createdAt: new Date(authUser.created_at),
      updatedAt: new Date(authUser.updated_at || authUser.created_at),
    }
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error)
    return null
  }
}

/**
 * A higher-order function to protect Server Actions.
 * It ensures the user is authenticated before executing the action.
 *
 * @param action The Server Action to protect. It must accept `AuthenticatedUser` as its first argument.
 * @returns A new function that performs the auth check before running the action.
 */
export function withAuth<T extends unknown[], U>(
  action: (user: AuthenticatedUser, ...args: T) => Promise<U>
) {
  return async (...args: T): Promise<U | { success: false; error: string }> => {
    const user = await getAuthenticatedUser()

    if (!user) {
      return { success: false, error: 'Authentication required' }
    }

    return action(user, ...args)
  }
} 