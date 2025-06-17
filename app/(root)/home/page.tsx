import { Separator } from '@/components/ui/separator'
import { QuickActionButton } from '@/components/ui/quick-action-button'
import { MAIN_QUICK_ACTIONS } from '@/lib/constants/navigation'
import { getUserWorkspaces } from '@/lib/db/workspaces'
import { getWorkspacePrompts } from '@/lib/db/prompts'
import { getAuthenticatedUser } from '@/lib/actions/auth/auth-helpers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

async function getHomePageData(userId: string) {
  try {
    const workspaces = await getUserWorkspaces(userId)
    
    // Get recent prompts from all workspaces
    const recentPrompts = []
    for (const workspace of workspaces.slice(0, 3)) { // Limit to first 3 workspaces
      try {
        const { prompts } = await getWorkspacePrompts(workspace.id, userId, {
          page: 1,
          limit: 5
        })
        recentPrompts.push(...prompts.map(prompt => ({
          ...prompt,
          workspace: workspace
        })))
      } catch (error) {
        console.error(`Error fetching prompts for workspace ${workspace.id}:`, error)
      }
    }

    // Sort by updated date and take latest 5
    recentPrompts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return { 
      workspaces, 
      recentPrompts: recentPrompts.slice(0, 5)
    }
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return { workspaces: [], recentPrompts: [] }
  }
}

export default async function HomePage() {
  const authenticatedUser = await getAuthenticatedUser()
  
  // Case 1: User is not authenticated at all. Redirect to sign-in.
  if (!authenticatedUser) {
    redirect('/sign-in')
  }

  // Case 2: User is authenticated, but the profile might not be fully available.
  // We can still render a welcome message. `authId` will be the same as `id` in this case.
  const isProfilePending = authenticatedUser.id === authenticatedUser.authId;
  
  // Only fetch detailed data if the profile is fully available.
  const pageData = !isProfilePending 
    ? await getHomePageData(authenticatedUser.id)
    : null;

  const displayName = authenticatedUser.fullName || authenticatedUser.username || authenticatedUser.email.split('@')[0]

  return (
    <div className="flex justify-center w-full min-h-full">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        {/* Welcome */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-1">
            Good morning, {displayName}
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            {isProfilePending
              ? "Welcome to Promption! Your workspace is being set up."
              : "Ready to create some amazing prompts?"}
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
          <h2 className="text-base md:text-lg font-medium text-neutral-900 mb-4">Recent prompts</h2>
          
          {isProfilePending ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : pageData && pageData.recentPrompts.length > 0 ? (
            <div className="space-y-3">
              {pageData.recentPrompts.map((prompt) => (
                <Link
                  key={prompt.id}
                  href={`/${prompt.workspace.slug}/${prompt.slug}`}
                  className="block rounded-lg border border-neutral-200 bg-white p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-neutral-900 truncate">
                          {prompt.title}
                        </h3>
                        {prompt.isTemplate && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                            Template
                          </span>
                        )}
                        {prompt.isPublic && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                            Public
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 truncate mb-2">
                        {prompt.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span>{prompt.workspace.name}</span>
                        <span>{prompt._count?.blocks || 0} blocks</span>
                        <span>Updated {formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="text-center pt-4">
                <Link 
                  href="/dashboard"
                  className="text-sm text-neutral-600 hover:text-neutral-900 underline"
                >
                  View all prompts
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-200 bg-white p-6 md:p-8">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-base md:text-lg font-medium text-neutral-900 mb-2">
                  No prompts yet
                </h3>
                <p className="text-sm md:text-base text-neutral-600 mb-6 max-w-sm mx-auto">
                  Start creating prompts and they&apos;ll appear here. Your recent activity will help you 
                  pick up where you left off.
                </p>
                <QuickActionButton 
                  action={MAIN_QUICK_ACTIONS[0]} 
                  className="mx-auto max-w-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 