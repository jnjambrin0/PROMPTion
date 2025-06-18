import { headers } from 'next/headers'

/**
 * Gets the IP address of the current request.
 * Tries to get the IP from the `x-forwarded-for` header, which is set by many proxy servers and load balancers.
 * Falls back to other headers and finally the request's remote address.
 * @returns The IP address of the current request, or null if it cannot be determined.
 */
export async function getRequestIp(): Promise<string | null> {
  const headersList = await headers()
  
  // Prioritize x-forwarded-for, which is a standard header for identifying the originating IP address.
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    // The x-forwarded-for header can contain a comma-separated list of IPs. The first one is the client's.
    return forwardedFor.split(',')[0].trim()
  }

  // Vercel-specific header for the client's IP address.
  const vercelIp = headersList.get('x-vercel-forwarded-for')
  if (vercelIp) {
    return vercelIp
  }

  // Real IP header, which may be set by some reverse proxies.
  const realIp = headersList.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Cloudflare-specific header.
  const cfConnectingIp = headersList.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  return null
} 