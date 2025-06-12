import { Separator } from '@/components/ui/separator'
import { QuickActionButton } from '@/components/ui/quick-action-button'
import { MAIN_QUICK_ACTIONS } from '@/lib/constants/navigation'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function HomePage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/signin')
  }

  return (
    <div className="flex justify-center w-full min-h-full">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        {/* Welcome */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-1">
            Good morning, {user.email?.split('@')[0]}
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            Ready to create some amazing prompts?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-medium text-neutral-900 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {MAIN_QUICK_ACTIONS.map((action) => (
              <QuickActionButton 
                key={action.id} 
                action={action} 
                variant="dashed"
              />
            ))}
          </div>
        </div>

        <Separator className="mb-6 md:mb-8" />

        {/* Recent Activity */}
        <div>
          <h2 className="text-base md:text-lg font-medium text-neutral-900 mb-4">Recent activity</h2>
          <div className="rounded-lg border border-neutral-200 bg-white p-6 md:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-base md:text-lg font-medium text-neutral-900 mb-2">
                No activity yet
              </h3>
              <p className="text-sm md:text-base text-neutral-600 mb-6 max-w-sm mx-auto">
                Start creating prompts and they'll appear here. Your recent activity will help you 
                pick up where you left off.
              </p>
              <QuickActionButton 
                action={MAIN_QUICK_ACTIONS[0]} 
                className="mx-auto max-w-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 