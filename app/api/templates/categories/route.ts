import { NextRequest, NextResponse } from 'next/server'
import { getTemplateCategories } from '@/lib/db/templates'
import { checkRateLimit, getClientIP, createRateLimitResponse, detectBot } from '@/lib/rate-limit'
import { validateHeaders } from '@/lib/security/validation'
import { logSecurityEvent } from '@/lib/dal'

// ==================== SECURE PUBLIC API ENDPOINT ====================
// Protected template categories endpoint according to SECURITY.md

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  try {
    // Bot detection - block suspicious user agents
    if (detectBot(userAgent)) {
      await logSecurityEvent({
        type: 'suspicious_activity',
        details: 'Bot detected accessing template categories',
        metadata: { ip, userAgent, endpoint: '/api/templates/categories' }
      })
      
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    // Header validation for security
    const headerValidation = validateHeaders(request.headers)
    if (!headerValidation.isValid) {
      await logSecurityEvent({
        type: 'suspicious_activity',
        details: `Suspicious headers in template categories: ${headerValidation.errors.join(', ')}`,
        metadata: { ip, userAgent }
      })
      
      return NextResponse.json(
        { error: 'Invalid request headers' },
        { status: 400 }
      )
    }
    
    // Rate limiting for public API - stricter than private APIs
    const rateLimitResult = await checkRateLimit(ip, 'public')
    
    if (!rateLimitResult.success) {
      await logSecurityEvent({
        type: 'suspicious_activity',
        details: 'Rate limit exceeded for template categories',
        metadata: { ip, userAgent, remaining: rateLimitResult.remaining }
      })
      
      return createRateLimitResponse(rateLimitResult)
    }
    
    // Fetch template categories
    const categories = await getTemplateCategories()
    
    // Create response with data
    const response = NextResponse.json({
      success: true,
      categories
    })
    
    // Security headers for API response
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Cache for 10 minutes - this data doesn't change often
    response.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=1200')
    
    // Rate limit information headers
    response.headers.set('X-RateLimit-Limit', '10')
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString())
    
    // Log successful access for monitoring
    console.log(`[API] Template categories accessed by ${ip} - Duration: ${Date.now() - startTime}ms`)
    
    return response
    
  } catch (error) {
    // Log security event for failed API access
    await logSecurityEvent({
      type: 'suspicious_activity',
      details: 'Template categories API error',
      metadata: { 
        ip, 
        userAgent, 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    })
    
    console.error('Error fetching template categories:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch template categories' },
      { 
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store'
        }
      }
    )
  }
}

// ==================== BLOCK OTHER HTTP METHODS ====================
// Only GET is allowed for this endpoint

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  await logSecurityEvent({
    type: 'suspicious_activity',
    details: 'Invalid POST request to template categories',
    metadata: { ip, userAgent, method: 'POST' }
  })
  
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT(request: NextRequest) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  await logSecurityEvent({
    type: 'suspicious_activity',
    details: 'Invalid PUT request to template categories',
    metadata: { ip, userAgent, method: 'PUT' }
  })
  
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  await logSecurityEvent({
    type: 'suspicious_activity',
    details: 'Invalid DELETE request to template categories',
    metadata: { ip, userAgent, method: 'DELETE' }
  })
  
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 