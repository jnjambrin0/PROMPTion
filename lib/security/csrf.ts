import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserOptional } from '@/lib/dal'

// ==================== CSRF PROTECTION SYSTEM ====================
// Implementation according to SECURITY.md recommendations for Next.js 15

interface CSRFTokenData {
  token: string
  timestamp: number
  userId?: string
}

// CSRF token configuration
const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour in milliseconds
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_COOKIE_NAME = 'csrf-token'

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(userId?: string): string {
  const randomBytes = crypto.randomBytes(CSRF_TOKEN_LENGTH)
  const timestamp = Date.now()
  
  const tokenData: CSRFTokenData = {
    token: randomBytes.toString('base64url'),
    timestamp,
    userId
  }
  
  // Sign the token with HMAC to prevent tampering
  const signature = crypto
    .createHmac('sha256', process.env.CSRF_SECRET || 'fallback-secret')
    .update(JSON.stringify(tokenData))
    .digest('base64url')
  
  const signedToken = `${Buffer.from(JSON.stringify(tokenData)).toString('base64url')}.${signature}`
  
  return signedToken
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, userId?: string): boolean {
  try {
    const [tokenPart, signature] = token.split('.')
    
    if (!tokenPart || !signature) {
      return false
    }
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CSRF_SECRET || 'fallback-secret')
      .update(Buffer.from(tokenPart, 'base64url').toString())
      .digest('base64url')
    
    if (signature !== expectedSignature) {
      console.warn('[CSRF] Invalid token signature')
      return false
    }
    
    // Parse token data
    const tokenData: CSRFTokenData = JSON.parse(
      Buffer.from(tokenPart, 'base64url').toString()
    )
    
    // Check expiry
    if (Date.now() - tokenData.timestamp > CSRF_TOKEN_EXPIRY) {
      console.warn('[CSRF] Token expired')
      return false
    }
    
    // Check user association if provided
    if (userId && tokenData.userId && tokenData.userId !== userId) {
      console.warn('[CSRF] Token user mismatch')
      return false
    }
    
    return true
  } catch (error) {
    console.error('[CSRF] Token verification error:', error)
    return false
  }
}

/**
 * CSRF middleware for API routes
 */
export async function validateCSRF(request: NextRequest): Promise<{
  isValid: boolean
  error?: NextResponse
}> {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return { isValid: true }
  }
  
  // Get token from header
  const tokenFromHeader = request.headers.get(CSRF_HEADER_NAME)
  
  // Get token from cookie for comparison
  const tokenFromCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value
  
  if (!tokenFromHeader) {
    console.warn('[CSRF] No CSRF token in header')
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'CSRF token required' },
        { status: 403 }
      )
    }
  }
  
  if (!tokenFromCookie) {
    console.warn('[CSRF] No CSRF token in cookie')
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'CSRF token required' },
        { status: 403 }
      )
    }
  }
  
  // Verify tokens match
  if (tokenFromHeader !== tokenFromCookie) {
    console.warn('[CSRF] Token mismatch between header and cookie')
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'CSRF token mismatch' },
        { status: 403 }
      )
    }
  }
  
  // Get current user for additional validation
  const currentUser = await getCurrentUserOptional()
  
  // Verify token
  const isValid = verifyCSRFToken(tokenFromHeader, currentUser?.id)
  
  if (!isValid) {
    console.warn('[CSRF] Invalid CSRF token')
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
  }
  
  return { isValid: true }
}

/**
 * Set CSRF token in response
 */
export function setCSRFToken(response: NextResponse, userId?: string): NextResponse {
  const token = generateCSRFToken(userId)
  
  // Set in cookie with secure options
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_EXPIRY / 1000, // Convert to seconds
    path: '/'
  })
  
  // Also set in header for client-side access
  response.headers.set('x-csrf-token', token)
  
  return response
}

/**
 * Validate Origin/Referer headers (additional CSRF protection)
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')
  
  if (!host) {
    return false
  }
  
  const allowedOrigins = [
    `https://${host}`,
    `http://${host}`, // For development
    process.env.NEXT_PUBLIC_APP_URL
  ].filter(Boolean)
  
  // Check Origin header
  if (origin && !allowedOrigins.includes(origin)) {
    console.warn(`[CSRF] Invalid origin: ${origin}`)
    return false
  }
  
  // Check Referer header
  if (referer) {
    const refererUrl = new URL(referer)
    const refererHost = refererUrl.host
    
    if (refererHost !== host) {
      console.warn(`[CSRF] Invalid referer: ${referer}`)
      return false
    }
  }
  
  return true
}

/**
 * Complete CSRF protection for API endpoints
 */
export async function protectCSRF(request: NextRequest): Promise<{
  isValid: boolean
  error?: NextResponse
}> {
  // Validate Origin/Referer
  if (!validateOrigin(request)) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      )
    }
  }
  
  // Validate CSRF token
  return await validateCSRF(request)
}

/**
 * API endpoint to get CSRF token
 */
export async function getCSRFTokenHandler(): Promise<NextResponse> {
  const currentUser = await getCurrentUserOptional()
  const token = generateCSRFToken(currentUser?.id)
  
  const response = NextResponse.json({
    success: true,
    csrfToken: token
  })
  
  return setCSRFToken(response, currentUser?.id)
}

// ==================== CONSTANTS ====================
export const CSRF_CONSTANTS = {
  HEADER_NAME: CSRF_HEADER_NAME,
  COOKIE_NAME: CSRF_COOKIE_NAME,
  TOKEN_EXPIRY: CSRF_TOKEN_EXPIRY
} as const 