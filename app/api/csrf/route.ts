import { NextResponse } from 'next/server'
import { getCSRFTokenHandler } from '@/lib/security/csrf'
import { getCurrentUserOptional } from '@/lib/dal'

// ==================== CSRF TOKEN ENDPOINT ====================
// Provides CSRF tokens for client-side form submissions

export async function GET() {
  try {
    return await getCSRFTokenHandler()
  } catch (error) {
    console.error('[CSRF] Error generating token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}

// Allow POST for token refresh
export async function POST() {
  try {
    // Verify user is authenticated for token refresh
    const currentUser = await getCurrentUserOptional()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return await getCSRFTokenHandler()
  } catch (error) {
    console.error('[CSRF] Error refreshing token:', error)
    return NextResponse.json(
      { error: 'Failed to refresh CSRF token' },
      { status: 500 }
    )
  }
} 