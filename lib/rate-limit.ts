import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ==================== RATE LIMITING CONFIGURATION ====================
// Security-focused rate limiting according to SECURITY.md recommendations

// Initialize Redis client for rate limiting
const redis = Redis.fromEnv()

// ==================== RATE LIMITING INSTANCES ====================

// API Rate Limiting - General API protection
export const apiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, '1m'), // 30 requests per minute
  analytics: true,
  prefix: 'api_rl',
})

// Authentication Rate Limiting - Prevent brute force attacks
export const authRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '5m'), // 5 attempts per 5 minutes
  analytics: true,
  prefix: 'auth_rl',
})

// Public API Rate Limiting - Stricter limits for unauthenticated endpoints
export const publicAPIRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1m'), // 10 requests per minute
  analytics: true,
  prefix: 'public_rl',
})

// Aggressive Rate Limiting - For suspected malicious activity
export const aggressiveRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, '10m'), // 3 requests per 10 minutes
  analytics: true,
  prefix: 'aggressive_rl',
})

// Password Reset Rate Limiting - Prevent abuse
export const passwordResetRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, '1h'), // 3 attempts per hour
  analytics: true,
  prefix: 'pwd_reset_rl',
})

// Feedback Submission Rate Limiting - Prevent spam
export const feedbackRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '10m'), // 5 submissions per 10 minutes
  analytics: true,
  prefix: 'feedback_rl',
})

// ==================== ADAPTIVE RATE LIMITING ====================
// Adjust limits based on server load and threat detection

interface ServerMetrics {
  memoryUsage: number
  cpuUsage: number
  activeConnections: number
}

export class AdaptiveRateLimit {
  private static instance: AdaptiveRateLimit
  private serverLoad = 0
  private threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'

  static getInstance(): AdaptiveRateLimit {
    if (!AdaptiveRateLimit.instance) {
      AdaptiveRateLimit.instance = new AdaptiveRateLimit()
    }
    return AdaptiveRateLimit.instance
  }

  updateServerMetrics(metrics: Partial<ServerMetrics>) {
    // Calculate server load based on available metrics
    if (metrics.memoryUsage !== undefined) {
      this.serverLoad = metrics.memoryUsage
    } else {
      // Fallback to Node.js memory usage
      const memoryUsage = process.memoryUsage()
      this.serverLoad = memoryUsage.heapUsed / memoryUsage.heapTotal
    }

    // Adjust threat level based on load
    if (this.serverLoad > 0.9) {
      this.threatLevel = 'critical'
    } else if (this.serverLoad > 0.75) {
      this.threatLevel = 'high'
    } else if (this.serverLoad > 0.6) {
      this.threatLevel = 'medium'
    } else {
      this.threatLevel = 'low'
    }
  }

  getRateLimit(category: 'api' | 'auth' | 'public'): number {
    switch (this.threatLevel) {
      case 'critical':
        return category === 'auth' ? 2 : category === 'public' ? 3 : 10
      case 'high':
        return category === 'auth' ? 3 : category === 'public' ? 5 : 15
      case 'medium':
        return category === 'auth' ? 4 : category === 'public' ? 8 : 20
      case 'low':
      default:
        return category === 'auth' ? 5 : category === 'public' ? 10 : 30
    }
  }

  getThreatLevel(): string {
    return this.threatLevel
  }
}

// ==================== IP-BASED SECURITY ====================

// Track suspicious IPs for enhanced security
export class IPSecurityTracker {
  private static instance: IPSecurityTracker
  private suspiciousIPs = new Map<string, number>()
  private blockedIPs = new Set<string>()

  static getInstance(): IPSecurityTracker {
    if (!IPSecurityTracker.instance) {
      IPSecurityTracker.instance = new IPSecurityTracker()
    }
    return IPSecurityTracker.instance
  }

  markSuspicious(ip: string) {
    const current = this.suspiciousIPs.get(ip) || 0
    this.suspiciousIPs.set(ip, current + 1)

    // Block IP after 3 suspicious activities
    if (current + 1 >= 3) {
      this.blockIP(ip)
    }
  }

  blockIP(ip: string) {
    this.blockedIPs.add(ip)
    console.warn(`[SECURITY] IP blocked: ${ip}`)
    // TODO: Integrate with cloud security service
  }

  isBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  isSuspicious(ip: string): boolean {
    return (this.suspiciousIPs.get(ip) || 0) >= 2
  }

  clearIP(ip: string) {
    this.suspiciousIPs.delete(ip)
    this.blockedIPs.delete(ip)
  }
}

// ==================== RATE LIMITING UTILITIES ====================

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: Date
  limit: number
}

/**
 * Check rate limit for a specific identifier and category
 */
export async function checkRateLimit(
  identifier: string,
  category: 'api' | 'auth' | 'public' | 'password-reset' | 'aggressive' | 'feedback'
): Promise<RateLimitResult> {
  const ipTracker = IPSecurityTracker.getInstance()

  // Check if IP is blocked
  if (ipTracker.isBlocked(identifier)) {
    return {
      success: false,
      remaining: 0,
      reset: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      limit: 0
    }
  }

  let rateLimit: Ratelimit

  switch (category) {
    case 'auth':
      rateLimit = authRateLimit
      break
    case 'public':
      rateLimit = publicAPIRateLimit
      break
    case 'password-reset':
      rateLimit = passwordResetRateLimit
      break
    case 'aggressive':
      rateLimit = aggressiveRateLimit
      break
    case 'feedback':
      rateLimit = feedbackRateLimit
      break
    default:
      rateLimit = apiRateLimit
      break
  }

  try {
    const result = await rateLimit.limit(identifier)
    
    // Mark as suspicious if rate limit exceeded
    if (!result.success) {
      ipTracker.markSuspicious(identifier)
    }

    return {
      success: result.success,
      remaining: result.remaining,
      reset: new Date(result.reset), // Convert timestamp to Date
      limit: result.limit
    }
  } catch (error) {
    console.error('[RATE_LIMIT] Error checking rate limit:', error)
    // Fail securely - deny request on error
    return {
      success: false,
      remaining: 0,
      reset: new Date(Date.now() + 60 * 1000), // 1 minute
      limit: 0
    }
  }
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  // Try various headers to get real client IP
  const xForwardedFor = request.headers.get('x-forwarded-for')
  const xRealIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (xRealIP) return xRealIP
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, first one is the client
    return xForwardedFor.split(',')[0].trim()
  }
  
  return '127.0.0.1' // Fallback for local development
}

/**
 * Bot detection patterns
 */
export function detectBot(userAgent: string): boolean {
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests',
    'scrapy', 'postman', 'insomnia', 'httpie', 'python-urllib'
  ]
  
  const ua = userAgent.toLowerCase()
  return botPatterns.some(pattern => ua.includes(pattern))
}

/**
 * Honeypot for detecting malicious activity
 */
export async function logHoneypotAccess(ip: string, userAgent: string) {
  const ipTracker = IPSecurityTracker.getInstance()
  
  console.warn('[HONEYPOT] Suspicious access detected:', {
    ip,
    userAgent,
    timestamp: new Date().toISOString()
  })
  
  // Mark as highly suspicious and apply aggressive rate limiting
  ipTracker.markSuspicious(ip)
  ipTracker.markSuspicious(ip) // Double mark for honeypot access
  
  // TODO: Send alert to security monitoring system
}

// ==================== RATE LIMIT MIDDLEWARE HELPER ====================

export function createRateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((result.reset.getTime() - Date.now()) / 1000)
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toISOString(),
        'Retry-After': Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString()
      }
    }
  )
} 