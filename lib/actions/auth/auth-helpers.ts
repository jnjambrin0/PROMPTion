import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { AuthenticatedUser } from '@/lib/types/shared'

/**
 * Retrieves the authenticated user if they have both a valid session
 * AND a complete profile in our database.
 * 
 * Users with only a Supabase session but no profile are considered
 * unauthenticated and will be redirected to complete their setup.
 *
 * @returns The authenticated user profile if fully valid, otherwise `null`.
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

    // CRITICAL: Only return a user if they have BOTH auth AND profile
    if (!profile) {
      console.error(
        `[AUTH] User has auth session but no profile. AuthId: ${authUser.id}. This user needs to complete registration.`
      )
      return null
    }

    return profile
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