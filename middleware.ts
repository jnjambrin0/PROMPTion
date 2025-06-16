import { NextResponse, type NextRequest } from 'next/server'

// ==================== SECURITY CONFIGURATION ====================
// WHITELIST APPROACH - Security by default according to SECURITY.md
// Only these routes are accessible without authentication

const PUBLIC_ROUTES = [
  '/', // Landing page
] as const

const AUTH_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
] as const

const AUTH_SYSTEM_ROUTES = [
  '/auth/confirm',
  '/auth/callback',
  '/auth/auth-code-error',
  '/auth/signout',
] as const

// API endpoints accessible to unauthenticated users (very limited)
const PUBLIC_API_ROUTES = [
  '/api/templates/categories', // For landing page template categories
  '/api/templates/stats', // For landing page statistics
] as const

// Static assets and system files  
const STATIC_PATHS = ['/favicon.ico', '/robots.txt', '/sitemap.xml', '/avatars', '/uploads', '/api/static'] as const

const STATIC_EXTENSIONS = [
  '.css', '.js', '.map', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
  '.woff', '.woff2', '.ttf', '.eot', '.otf'
] as const

// ==================== SECURITY HEADERS ====================
function setSecurityHeaders(response: NextResponse): NextResponse {
  // Very permissive CSP that won't block CSS/JS
  const cspHeader = `
    default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https:;
    connect-src 'self' https: wss:;
  `.replace(/\s{2,}/g, ' ').trim()
  
  // Set only essential security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN') // Less restrictive
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

// ==================== OPTIMISTIC SESSION VALIDATION ====================
// According to SECURITY.md, middleware should only do optimistic checks
// SIMPLIFIED to prevent infinite loops and improve performance
async function validateSessionOptimistic(request: NextRequest): Promise<boolean> {
  try {
    // Super simple check - just look for ANY Supabase auth cookies
    const allCookies = request.cookies.getAll()
    const hasSupabaseCookie = allCookies.some(cookie => 
      cookie.name.includes('sb-') || 
      cookie.name.includes('supabase')
    )
    
    // If we have any Supabase-related cookie, assume authenticated
    // Let the actual pages handle proper validation with the DAL
    return hasSupabaseCookie
  } catch {
    // On any error, assume not authenticated
    return false
  }
}

// ==================== SECURE COOKIE UTILITIES ====================
// TODO: Implement secure Supabase client when needed for auth callbacks
// The middleware now focuses on optimistic validation only

// ==================== SECURITY LOGGING ====================
function logSecurityEvent(type: string, pathname: string, details?: string) {
  const timestamp = new Date().toISOString()
  console.warn(`[SECURITY] ${timestamp} - ${type} - ${pathname}${details ? ` - ${details}` : ''}`)
}

// ==================== MAIN MIDDLEWARE ====================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Static file check - if any static file reaches here, let it pass immediately
  if (pathname.endsWith('.css') || pathname.endsWith('.js')) {
    console.warn(`[MIDDLEWARE] Static file reached middleware unexpectedly: ${pathname}`)
    return NextResponse.next()
  }
  
  // ABSOLUTE FIRST PRIORITY: If any static file somehow reaches here, let it pass immediately
  if (pathname.startsWith('/_next/') || 
      STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext)) ||
      STATIC_PATHS.some(path => pathname.startsWith(path))) {
    console.log(`[DEBUG] Allowing static file: ${pathname}`)
    return NextResponse.next()
  }

  // Allow auth system routes (callbacks, etc.) - no security headers needed
  if (AUTH_SYSTEM_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Check route types BEFORE session validation
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname as '/')
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const isPublicAPI = PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))

  // Public routes and APIs - allow with security headers but no auth check
  if (isPublicRoute || isPublicAPI) {
    const response = NextResponse.next({ request })
    return setSecurityHeaders(response)
  }

  // NOW do session validation (only for routes that actually need it)
  const hasValidSession = await validateSessionOptimistic(request)
  
  // DEBUG: Log session validation result
  if (pathname.startsWith('/home') || pathname.startsWith('/sign-in')) {
    console.log(`[DEBUG] Session validation for ${pathname}: ${hasValidSession}`)
  }

  // Auth routes - redirect if already authenticated
  if (isAuthRoute) {
    if (hasValidSession) {
      logSecurityEvent('AUTH_REDIRECT', pathname, 'Authenticated user redirected from auth route')
      return NextResponse.redirect(new URL('/home', request.url))
    }
    const response = NextResponse.next({ request })
    return setSecurityHeaders(response)
  }

  // All other routes require authentication
  if (!hasValidSession) {
    // Prevent infinite redirect loops by checking if we're already redirecting
    const url = new URL(request.url)
    if (url.searchParams.get('redirected') === 'true') {
      console.warn(`[SECURITY] Infinite redirect loop detected for ${pathname}`)
      // Allow the request to proceed to prevent infinite loop
      const response = NextResponse.next({ request })
      return setSecurityHeaders(response)
    }
    
    logSecurityEvent('ACCESS_DENIED', pathname, 'Unauthenticated access blocked')
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirected', 'true')
    redirectUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Authenticated access to protected routes
  logSecurityEvent('ACCESS_GRANTED', pathname, 'Authenticated access granted')
  const response = NextResponse.next({ request })
  return setSecurityHeaders(response)
}

// ==================== MATCHER CONFIGURATION ====================
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/ directory (Next.js static files) 
     * - Static file extensions (css, js, images, fonts)
     * - System files (favicon, robots, sitemap)
     * - Avatar images and uploads directory
     * 
     * This ensures static files NEVER reach the middleware
     */
    '/((?!_next/|avatars/|uploads/|api/static/|.*\\.(?:css|js|map|ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|otf)$|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)',
  ],
} 