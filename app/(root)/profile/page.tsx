import { getCurrentUser } from '@/lib/dal'
import ProfileClient from './profile-client'

// Force dynamic rendering for this page since it requires authentication
export const dynamic = 'force-dynamic'

// Server component - handles authentication and data fetching
export default async function ProfilePage() {
  // Use new DAL for secure authentication - this handles all security checks
  const user = await getCurrentUser()

  // Calculate user stats (in a real app, these could come from separate DB queries)
  // TODO: Implement actual stats calculation with database queries

  return (
    <ProfileClient 
      initialProfile={user}
    />
  )
} 