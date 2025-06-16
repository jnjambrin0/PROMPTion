import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import type { AuthenticatedUser } from '@/lib/types/shared'

// ==================== SECURITY-FIRST DAL ====================
// According to SECURITY.md, this is the new security frontier for Next.js 15
// All authentication and authorization checks must happen here, not in middleware

/**
 * PRIMARY SECURITY BOUNDARY - Gets current authenticated user
 * This function implements the security recommendations from SECURITY.md
 * Uses React cache for performance while maintaining security
 */
export const getCurrentUser = cache(async (): Promise<AuthenticatedUser> => {
  try {
    const supabase = await createClient()
    
    // Use getUser() for server-side validation (not getSession())
    // This prevents session hijacking vulnerabilities
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('[DAL] Auth error:', error.message)
      redirect('/sign-in')
    }
    
    if (!authUser) {
      redirect('/sign-in')
    }
    
    // Get complete user data from database
    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      console.error('[DAL] User not found in database:', authUser.id)
      redirect('/sign-in')
    }
    
    return user as AuthenticatedUser
  } catch (error) {
    console.error('[DAL] getCurrentUser failed:', error)
    redirect('/sign-in')
  }
})

/**
 * SECURITY BOUNDARY - Gets current user or null (no redirect)
 * Use this for optional authentication checks
 */
export const getCurrentUserOptional = cache(async (): Promise<AuthenticatedUser | null> => {
  try {
    const supabase = await createClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    
    if (error || !authUser) {
      return null
    }
    
    const user = await getUserByAuthId(authUser.id)
    return user as AuthenticatedUser | null
  } catch (error) {
    console.error('[DAL] getCurrentUserOptional failed:', error)
    return null
  }
})

/**
 * AUTHORIZATION BOUNDARY - Gets user data with access control
 * Implements strict authorization checks to prevent unauthorized access
 */
export const getUserData = cache(async (userId: string): Promise<AuthenticatedUser> => {
  const currentUser = await getCurrentUser()
  
  // Critical authorization check - users can only access their own data
  // Note: Role-based access control would be implemented here when roles are added to the schema
  if (currentUser.id !== userId) {
    console.error('[DAL] Unauthorized access attempt:', {
      currentUserId: currentUser.id,
      requestedUserId: userId
    })
    throw new Error('Unauthorized access')
  }
  
  // Return sanitized user data (DTO pattern)
  return {
    id: currentUser.id,
    email: currentUser.email,
    username: currentUser.username,
    fullName: currentUser.fullName,
    bio: currentUser.bio,
    avatarUrl: currentUser.avatarUrl,
    authId: currentUser.authId,
    emailVerified: currentUser.emailVerified,
    isActive: currentUser.isActive,
    lastActiveAt: currentUser.lastActiveAt,
    createdAt: currentUser.createdAt,
    updatedAt: currentUser.updatedAt
  } as AuthenticatedUser
})

// Define workspace types for type safety
interface WorkspaceAccess {
  user: AuthenticatedUser
  workspace: WorkspaceData | null
  role: 'owner' | 'admin' | 'member' | 'viewer'
}

interface WorkspaceData {
  id: string
  name: string
  slug: string
  description?: string
}

/**
 * WORKSPACE ACCESS CONTROL - Checks if user has access to workspace
 */
export const verifyWorkspaceAccess = cache(async (workspaceSlug: string): Promise<WorkspaceAccess> => {
  const currentUser = await getCurrentUser()
  
  // TODO: Implement workspace access verification based on workspaceSlug
  // This should query the database to verify membership and get user role
  console.log(`[DAL] Checking workspace access for: ${workspaceSlug}`)
  
  return {
    user: currentUser,
    workspace: null, // TODO: Implement workspace fetching with access control
    role: 'member' // TODO: Get actual role from workspace membership
  }
})

/**
 * SECURITY LOGGING - Logs security events for monitoring
 * Essential for detecting and responding to security incidents
 */
export const logSecurityEvent = async (event: {
  type: 'auth_failure' | 'unauthorized_access' | 'suspicious_activity' | 'permission_denied'
  userId?: string
  details: string
  metadata?: Record<string, string | number | boolean>
}) => {
  const timestamp = new Date().toISOString()
  
  // In production, send to your security monitoring system
  console.warn('[SECURITY EVENT]', {
    timestamp,
    ...event
  })
  
  // TODO: Integrate with your monitoring solution (e.g., DataDog, Sentry)
  // await sendToSecurityMonitoring(event)
}

/**
 * SESSION VALIDATION - Validates session integrity
 * Prevents session hijacking and timing attacks
 */
export const validateSession = cache(async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('sb-access-token')?.value
    
    if (!sessionCookie) {
      return false
    }
    
    // Validate session without database calls (optimistic check)
    // This is what middleware should do according to SECURITY.md
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    return !error && !!user
  } catch (error) {
    await logSecurityEvent({
      type: 'auth_failure',
      details: 'Session validation failed',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
    return false
  }
})

/**
 * SECURE REDIRECT - Prevents open redirect vulnerabilities
 */
export const secureRedirect = (redirectUrl?: string | null): string => {
  // Default safe redirect
  const defaultRedirect = '/home'
  
  if (!redirectUrl) {
    return defaultRedirect
  }
  
  // Prevent open redirect attacks
  if (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
    console.warn('[DAL] Prevented open redirect attempt:', redirectUrl)
    return defaultRedirect
  }
  
  return redirectUrl
}

// Export types for consistency
export type { AuthenticatedUser } 