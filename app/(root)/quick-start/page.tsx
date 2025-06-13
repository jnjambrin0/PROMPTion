import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getUserByAuthId } from '@/lib/db/users'
import { getUserWorkspaces } from '@/lib/db/workspaces'
import { QuickStartHeader } from './components/quick-start-header'
import { QuickStartSections } from './components/quick-start-sections'
import { QuickStartFooter } from './components/quick-start-footer'


async function getUserData() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null

    const user = await getUserByAuthId(authUser.id)
    if (!user) return null

    const workspaces = await getUserWorkspaces(user.id)
    
    return { user, workspaces }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export default async function QuickStartPage() {
  const userData = await getUserData()
  
  if (!userData) {
    redirect('/sign-in')
  }

  const { user, workspaces } = userData
  const primaryWorkspace = workspaces.length > 0 ? workspaces[0] : null

  return (
    <div className="min-h-screen bg-gray-25">
      <QuickStartHeader />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <QuickStartSections primaryWorkspace={primaryWorkspace} />
        <QuickStartFooter />
      </main>
    </div>
  )
} 