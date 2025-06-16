import { logSecurityEvent } from '@/lib/dal'

// ==================== SECURITY MONITORING SYSTEM ====================
// Centralized security monitoring according to SECURITY.md

export interface SecurityEvent {
  type: 'auth_failure' | 'unauthorized_access' | 'suspicious_activity' | 'permission_denied' | 
        'rate_limit_exceeded' | 'csrf_violation' | 'injection_attempt' | 'bot_detected'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: 'middleware' | 'api' | 'auth' | 'form' | 'upload'
  userId?: string
  ip: string
  userAgent: string
  endpoint: string
  details: string
  metadata?: Record<string, string | number | boolean>
  timestamp: Date
}

export interface SecurityMetrics {
  authFailures: number
  rateLimitViolations: number
  csrfViolations: number
  botDetections: number
  suspiciousActivities: number
  blockedIPs: number
  lastHour: SecurityEvent[]
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
}

// In-memory storage for recent events (in production, use Redis or database)
const recentEvents: SecurityEvent[] = []
const MAX_RECENT_EVENTS = 1000

// Blocked IPs and suspicious patterns
const blockedIPs = new Set<string>()
const suspiciousPatterns = new Map<string, number>()

// ==================== EVENT LOGGING ====================

/**
 * Map monitoring event types to DAL event types
 */
function mapEventTypeToDAL(type: SecurityEvent['type']): 'auth_failure' | 'unauthorized_access' | 'suspicious_activity' | 'permission_denied' {
  switch (type) {
    case 'auth_failure':
      return 'auth_failure'
    case 'unauthorized_access':
      return 'unauthorized_access'
    case 'permission_denied':
      return 'permission_denied'
    case 'rate_limit_exceeded':
    case 'csrf_violation':
    case 'injection_attempt':
    case 'bot_detected':
    default:
      return 'suspicious_activity'
  }
}

/**
 * Log security event with enhanced monitoring
 */
export async function logSecurityEventEnhanced(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date()
  }
  
  // Add to recent events
  recentEvents.unshift(securityEvent)
  if (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.pop()
  }
  
  // Update threat patterns
  updateThreatPatterns(securityEvent)
  
  // Log using existing DAL function - map event types to DAL types
  const dalEventType = mapEventTypeToDAL(event.type)
  await logSecurityEvent({
    type: dalEventType,
    userId: event.userId,
    details: event.details,
    metadata: event.metadata
  })
  
  // Check for immediate threats
  await analyzeForImmediateThreats(securityEvent)
  
  // Log to console with severity
  const logLevel = event.severity === 'critical' ? 'error' : 
                  event.severity === 'high' ? 'warn' : 'log'
  
  console[logLevel](`[SECURITY:${event.severity.toUpperCase()}] ${event.type} - ${event.details}`, {
    ip: event.ip,
    endpoint: event.endpoint,
    userAgent: event.userAgent.slice(0, 100),
    timestamp: securityEvent.timestamp.toISOString()
  })
}

/**
 * Update threat patterns for analysis
 */
function updateThreatPatterns(event: SecurityEvent): void {
  const key = `${event.ip}:${event.type}`
  const current = suspiciousPatterns.get(key) || 0
  suspiciousPatterns.set(key, current + 1)
  
  // Auto-block IPs with multiple violations
  if (current + 1 >= 5) {
    blockedIPs.add(event.ip)
    console.warn(`[SECURITY] Auto-blocked IP ${event.ip} after ${current + 1} violations`)
  }
}

/**
 * Analyze for immediate threats that require action
 */
async function analyzeForImmediateThreats(event: SecurityEvent): Promise<void> {
  // Critical events require immediate attention
  if (event.severity === 'critical') {
    await sendCriticalAlert(event)
  }
  
  // Multiple rapid events from same IP
  const recentFromIP = recentEvents
    .filter(e => e.ip === event.ip && e.timestamp > new Date(Date.now() - 5 * 60 * 1000))
  
  if (recentFromIP.length >= 10) {
    blockedIPs.add(event.ip)
         await logSecurityEventEnhanced({
       type: 'suspicious_activity',
       severity: 'high',
       source: 'middleware',
       ip: event.ip,
       userAgent: event.userAgent,
       endpoint: event.endpoint,
       details: `Auto-blocked IP after ${recentFromIP.length} rapid events`,
       metadata: { eventCount: recentFromIP.length }
     })
  }
}

/**
 * Send critical security alert
 */
async function sendCriticalAlert(event: SecurityEvent): Promise<void> {
  // In production, integrate with alerting service (PagerDuty, Slack, etc.)
  console.error('[CRITICAL SECURITY ALERT]', {
    type: event.type,
    ip: event.ip,
    endpoint: event.endpoint,
    details: event.details,
    timestamp: event.timestamp.toISOString()
  })
  
  // TODO: Integrate with alerting service
  // await alertingService.sendAlert({
  //   priority: 'critical',
  //   message: `Security incident: ${event.type} from ${event.ip}`,
  //   details: event
  // })
}

// ==================== THREAT DETECTION ====================

/**
 * Detect suspicious patterns in user behavior
 */
export function detectSuspiciousPattern(
  ip: string,
  userAgent: string,
  endpoint: string
): { isSuspicious: boolean; reason?: string; severity: 'low' | 'medium' | 'high' } {
  // Check blocked IPs
  if (blockedIPs.has(ip)) {
    return { isSuspicious: true, reason: 'Blocked IP', severity: 'high' }
  }
  
  // Check for rapid requests from same IP
  const recentFromIP = recentEvents
    .filter(e => e.ip === ip && e.timestamp > new Date(Date.now() - 60 * 1000))
  
  if (recentFromIP.length >= 20) {
    return { isSuspicious: true, reason: 'Rapid requests', severity: 'high' }
  }
  
  // Check for suspicious user agent patterns
  const suspiciousUA = [
    'python-requests', 'curl', 'wget', 'scrapy', 'bot', 'crawler',
    'spider', 'scraper', 'postman', 'insomnia', 'httpie'
  ]
  
  if (suspiciousUA.some(pattern => userAgent.toLowerCase().includes(pattern))) {
    return { isSuspicious: true, reason: 'Suspicious user agent', severity: 'medium' }
  }
  
  // Check for SQL injection patterns in endpoint
  const sqlPatterns = [
    'union', 'select', 'insert', 'update', 'delete', 'drop',
    'exec', 'script', 'onload', 'onerror', 'javascript:'
  ]
  
  if (sqlPatterns.some(pattern => endpoint.toLowerCase().includes(pattern))) {
    return { isSuspicious: true, reason: 'Potential injection attempt', severity: 'high' }
  }
  
  return { isSuspicious: false, severity: 'low' }
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip)
}

/**
 * Get current security metrics
 */
export function getSecurityMetrics(): SecurityMetrics {
  const lastHour = recentEvents.filter(
    e => e.timestamp > new Date(Date.now() - 60 * 60 * 1000)
  )
  
  const authFailures = lastHour.filter(e => e.type === 'auth_failure').length
  const rateLimitViolations = lastHour.filter(e => e.type === 'rate_limit_exceeded').length
  const csrfViolations = lastHour.filter(e => e.type === 'csrf_violation').length
  const botDetections = lastHour.filter(e => e.type === 'bot_detected').length
  const suspiciousActivities = lastHour.filter(e => e.type === 'suspicious_activity').length
  
  // Calculate threat level
  let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  
  if (authFailures > 50 || rateLimitViolations > 100 || suspiciousActivities > 20) {
    threatLevel = 'critical'
  } else if (authFailures > 20 || rateLimitViolations > 50 || suspiciousActivities > 10) {
    threatLevel = 'high'
  } else if (authFailures > 10 || rateLimitViolations > 20 || suspiciousActivities > 5) {
    threatLevel = 'medium'
  }
  
  return {
    authFailures,
    rateLimitViolations,
    csrfViolations,
    botDetections,
    suspiciousActivities,
    blockedIPs: blockedIPs.size,
    lastHour,
    threatLevel
  }
}

/**
 * Security health check
 */
export function getSecurityHealth(): {
  status: 'healthy' | 'warning' | 'critical'
  issues: string[]
  recommendations: string[]
} {
  const metrics = getSecurityMetrics()
  const issues: string[] = []
  const recommendations: string[] = []
  
  // Check for high threat level
  if (metrics.threatLevel === 'critical') {
    issues.push('Critical threat level detected')
    recommendations.push('Review security logs immediately')
  } else if (metrics.threatLevel === 'high') {
    issues.push('High threat level detected')
    recommendations.push('Monitor security events closely')
  }
  
  // Check for high error rates
  if (metrics.authFailures > 20) {
    issues.push(`High authentication failure rate: ${metrics.authFailures}/hour`)
    recommendations.push('Consider additional authentication measures')
  }
  
  if (metrics.rateLimitViolations > 50) {
    issues.push(`High rate limit violations: ${metrics.rateLimitViolations}/hour`)
    recommendations.push('Review rate limiting configuration')
  }
  
  if (metrics.blockedIPs > 10) {
    issues.push(`High number of blocked IPs: ${metrics.blockedIPs}`)
    recommendations.push('Review IP blocking rules')
  }
  
  const status = issues.length > 2 ? 'critical' : 
                issues.length > 0 ? 'warning' : 'healthy'
  
  return { status, issues, recommendations }
}

// ==================== CLEANUP ====================

/**
 * Clean up old events and reset counters
 */
export function cleanupSecurityData(): void {
  // Remove events older than 24 hours
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const oldEventsCount = recentEvents.length
  
  // Remove old events
  while (recentEvents.length > 0 && recentEvents[recentEvents.length - 1].timestamp < cutoff) {
    recentEvents.pop()
  }
  
  // Clean up suspicious patterns older than 1 hour
  const patternCutoff = Date.now() - 60 * 60 * 1000
  for (const [key, timestamp] of suspiciousPatterns.entries()) {
    if (timestamp < patternCutoff) {
      suspiciousPatterns.delete(key)
    }
  }
  
  console.log(`[SECURITY] Cleanup completed. Removed ${oldEventsCount - recentEvents.length} old events`)
}

// Run cleanup every hour
setInterval(cleanupSecurityData, 60 * 60 * 1000) 