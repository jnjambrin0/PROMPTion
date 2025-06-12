import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { redirect } from 'next/navigation'
import { ProfileClient } from './profile-client'


// Server component - handles authentication and data fetching
export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/sign-in')
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    redirect('/sign-in')
  }

  // Calculate user stats (in a real app, these could come from separate DB queries)
  // TODO: Implement actual stats calculation with database queries
  const userStats = {
    promptsCreated: 0, // TODO: Count user's prompts
    templatesShared: 0, // TODO: Count public prompts
    workspacesJoined: 0, // TODO: Count workspaces user is member of
    joinedDate: user.createdAt.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <ProfileClient 
      user={user}
      authUser={authUser}
      userStats={userStats}
    />
  )
} 