import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'

interface AuthResult {
  success: boolean
  user?: any
  error?: string
}

/**
 * Reusable authentication helper for Server Actions
 */
export async function authenticateUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { success: false, error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

/**
 * HOC for Server Actions that require authentication
 */
export function withAuth<T extends any[], R>(
  action: (user: any, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | { success: false; error: string }> => {
    const authResult = await authenticateUser()
    
    if (!authResult.success) {
      return { success: false, error: authResult.error! } as any
    }

    return action(authResult.user!, ...args)
  }
} 