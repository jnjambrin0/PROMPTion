import { z } from 'zod'

// ==================== VALIDATION SCHEMAS ====================
// Robust input validation according to SECURITY.md recommendations

// Common validation patterns
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(3, 'Email too short')
  .max(254, 'Email too long') // RFC 5321 limit
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must not exceed 64 characters') // NIST 2025 guideline
  .refine(password => !isCommonPassword(password), 'Password is too common')

export const slugSchema = z
  .string()
  .min(3, 'Slug too short')
  .max(63, 'Slug too long')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')

export const uuidSchema = z
  .string()
  .uuid('Invalid UUID format')

export const userAgentSchema = z
  .string()
  .max(2048, 'User agent too long')
  .refine(ua => !isMaliciousUserAgent(ua), 'Suspicious user agent detected')

// API request validation
export const paginationSchema = z.object({
  page: z.number().int().min(1).max(1000).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).optional()
})

export const sortSchema = z.object({
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// ==================== PASSWORD VALIDATION - NIST 2025 ====================
// Implementation according to SECURITY.md NIST 2025 guidelines

const COMMON_PASSWORDS = new Set([
  'password', '123456', 'qwerty', 'admin', 'welcome', 'letmein',
  'monkey', '1234567890', 'password123', 'admin123', 'root',
  'guest', 'test', 'user', 'demo', 'changeme', 'default',
  'master', 'super', 'login', 'pass', 'secret', 'temp'
])

interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: number
  recommendations: string[]
}

export function validatePasswordNIST(
  password: string, 
  userInfo: { email?: string; name?: string; username?: string } = {}
): PasswordValidationResult {
  const errors: string[] = []
  const recommendations: string[] = []
  
  // NIST 2025 Requirements
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (password.length > 64) {
    errors.push('Password must not exceed 64 characters')
  }
  
  // Check against common passwords
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push('Password is too common')
    recommendations.push('Use a unique password that is not commonly used')
  }
  
  // Check against user information
  const userInfoValues = Object.values(userInfo)
    .filter(Boolean)
    .map(val => val!.toLowerCase())
  
  if (userInfoValues.some(info => password.toLowerCase().includes(info))) {
    errors.push('Password must not contain personal information')
    recommendations.push('Avoid using your name, email, or username in your password')
  }
  
  // Check for repeated patterns
  if (hasRepeatedPatterns(password)) {
    errors.push('Password contains repeated patterns')
    recommendations.push('Avoid repeated characters or simple patterns')
  }
  
  // Calculate strength score (0-4)
  let strength = 0
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  // Minimum strength requirement
  if (strength < 3) {
    errors.push('Password is too weak')
    recommendations.push('Use a mix of uppercase, lowercase, numbers, and special characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
    recommendations
  }
}

function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase())
}

function hasRepeatedPatterns(password: string): boolean {
  // Check for repeated characters (3+ consecutive)
  if (/(.)\1{2,}/.test(password)) return true
  
  // Check for simple sequences
  const sequences = ['123', 'abc', 'qwe', 'asd', 'zxc']
  return sequences.some(seq => password.toLowerCase().includes(seq))
}

// ==================== USER AGENT VALIDATION ====================

function isMaliciousUserAgent(userAgent: string): boolean {
  const maliciousPatterns = [
    'python-requests', 'curl', 'wget', 'scrapy', 'bot', 'crawler',
    'spider', 'scraper', 'postman', 'insomnia', 'httpie',
    'python-urllib', 'perl', 'ruby', 'java', 'go-http-client',
    'okhttp', 'axios', 'node-fetch', 'undici'
  ]
  
  const ua = userAgent.toLowerCase()
  return maliciousPatterns.some(pattern => ua.includes(pattern))
}

// ==================== TIMING ATTACK PREVENTION ====================

/**
 * Secure string comparison to prevent timing attacks
 */
export function secureCompare(provided: string, stored: string): boolean {
  if (provided.length !== stored.length) {
    // Perform dummy comparison to maintain constant time
    const dummy = 'a'.repeat(stored.length)
    return constantTimeCompare(provided, dummy) && false
  }
  
  return constantTimeCompare(provided, stored)
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Enforce minimum response time to prevent timing attacks
 */
export async function enforceMinimumTime(startTime: number, minTime: number): Promise<void> {
  const elapsed = Date.now() - startTime
  if (elapsed < minTime) {
    await new Promise(resolve => setTimeout(resolve, minTime - elapsed))
  }
}

// ==================== INPUT SANITIZATION ====================

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/XML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .slice(0, 1000) // Limit length
}

/**
 * Validate file upload
 */
export interface FileValidationOptions {
  maxSize: number // in bytes
  allowedTypes: string[]
  allowedExtensions: string[]
}

export function validateFile(
  file: File, 
  options: FileValidationOptions
): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > options.maxSize) {
    return { 
      isValid: false, 
      error: `File size exceeds ${Math.round(options.maxSize / 1024 / 1024)}MB limit` 
    }
  }
  
  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'File type not allowed' 
    }
  }
  
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !options.allowedExtensions.includes(extension)) {
    return { 
      isValid: false, 
      error: 'File extension not allowed' 
    }
  }
  
  return { isValid: true }
}

// ==================== REQUEST VALIDATION ====================

/**
 * Validate and sanitize request headers
 */
export function validateHeaders(headers: Headers): {
  isValid: boolean
  sanitized: Record<string, string>
  errors: string[]
} {
  const errors: string[] = []
  const sanitized: Record<string, string> = {}
  
  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-cluster-client-ip',
    'x-forwarded-host',
    'x-original-url',
    'x-rewrite-url'
  ]
  
  for (const [key, value] of headers.entries()) {
    const lowerKey = key.toLowerCase()
    
    if (suspiciousHeaders.includes(lowerKey)) {
      errors.push(`Suspicious header detected: ${key}`)
      continue
    }
    
    // Sanitize header value
    const sanitizedValue = value
      .replace(/[\r\n]/g, '') // Remove CRLF injection
      .slice(0, 1024) // Limit length
    
    sanitized[key] = sanitizedValue
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  }
}

/**
 * Rate limit validation result
 */
export interface RateLimitValidation {
  isValid: boolean
  error?: string
  remaining?: number
}

// ==================== SECURITY DECORATORS ====================

/**
 * Security decorator for API endpoints
 */
export function withSecurity<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  options: {
    requireAuth?: boolean
    rateLimit?: 'api' | 'public' | 'auth' | 'aggressive'
    validateInput?: z.ZodSchema
    logAccess?: boolean
  } = {}
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now()
    
    try {
      // Authentication check
      if (options.requireAuth) {
        // This would be implemented based on your auth system
        // For now, placeholder
      }
      
      // Rate limiting
      if (options.rateLimit) {
        // This would integrate with your rate limiting system
        // For now, placeholder
      }
      
      // Input validation
      if (options.validateInput && args[0]) {
        const validation = options.validateInput.safeParse(args[0])
        if (!validation.success) {
          throw new Error(`Invalid input: ${validation.error.message}`)
        }
      }
      
      // Execute handler
      const result = await handler(...args)
      
      // Log successful access
      if (options.logAccess) {
        console.log(`[SECURITY] API access successful - Duration: ${Date.now() - startTime}ms`)
      }
      
      return result
    } catch (error) {
      // Log failed access
      if (options.logAccess) {
        console.error(`[SECURITY] API access failed - Duration: ${Date.now() - startTime}ms`, error)
      }
      
      throw error
    }
  }
} 