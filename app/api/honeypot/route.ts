import { NextRequest, NextResponse } from 'next/server'
import { logHoneypotAccess, getClientIP, IPSecurityTracker } from '@/lib/rate-limit'

// ==================== HONEYPOT ENDPOINT ====================
// This endpoint is designed to catch malicious bots and scrapers
// According to SECURITY.md, any access to this endpoint is suspicious

export async function GET(request: NextRequest) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Log honeypot access - this is always suspicious
  await logHoneypotAccess(ip, userAgent)
  
  // Block the IP immediately
  const ipTracker = IPSecurityTracker.getInstance()
  ipTracker.blockIP(ip)
  
  // Return fake data to waste scraper time and resources
  return NextResponse.json({
    users: [
      { id: '00000000-0000-0000-0000-000000000000', email: 'fake@example.com', token: 'fake_token_12345' },
      { id: '11111111-1111-1111-1111-111111111111', email: 'decoy@nowhere.com', token: 'trap_token_67890' }
    ],
    apiKeys: [
      'sk-fake_api_key_abcdefghijklmnopqrstuvwxyz123456',
      'sk-trap_key_zyxwvutsrqponmlkjihgfedcba654321'
    ],
    database: {
      host: 'fake-db.example.com',
      username: 'honeypot_user',
      password: 'fake_password_123',
      port: 5432
    },
    secrets: {
      jwt_secret: 'fake_jwt_secret_abcd1234',
      encryption_key: 'trap_encryption_xyz9876',
      webhook_url: 'https://fake-webhook.example.com/trap'
    },
    message: 'Internal API - Authorized access only',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Log honeypot access
  await logHoneypotAccess(ip, userAgent)
  
  // Block the IP
  const ipTracker = IPSecurityTracker.getInstance()
  ipTracker.blockIP(ip)
  
  // Pretend to process the request
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000))
  
  return NextResponse.json({
    success: true,
    message: 'Data processed successfully',
    id: `fake_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString()
  }, {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  })
}

// Handle other HTTP methods
export async function PUT(request: NextRequest) {
  return POST(request) // Same handling as POST
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  await logHoneypotAccess(ip, userAgent)
  
  const ipTracker = IPSecurityTracker.getInstance()
  ipTracker.blockIP(ip)
  
  return NextResponse.json({
    success: true,
    message: 'Resource deleted successfully',
    deleted_count: Math.floor(Math.random() * 100) + 1
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  })
} 