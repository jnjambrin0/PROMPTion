import React from 'react'
import { Separator } from '@/components/ui/separator'
import { TrendingUpIcon, TrendingDownIcon, PlusCircle } from 'lucide-react'
import { getQuickStatsFormatted, getRecentActivity, formatTimeAgo, getActivityIcon, getActivityDescription } from '@/lib/db/stats'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'

async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null
    
    const user = await prisma.user.findUnique({
      where: { authId: authUser.id },
      include: {
        workspaceMembers: {
          select: {
            workspaceId: true,
            role: true
          }
        }
      }
    })
    
    return { authUser, user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function RightSidebar() {
  // Obtener datos del usuario autenticado
  const userData = await getUser()
  
  if (!userData?.user || !userData.authUser) {
    redirect('/sign-in')
  }

  const { user } = userData
  
  // Por ahora usamos el primer workspace del usuario
  // En el futuro esto debería venir del contexto del workspace actual
  const currentWorkspaceId = user.workspaceMembers[0]?.workspaceId
  
  if (!currentWorkspaceId) {
    return (
      <aside className="w-72 border-l h-full border-gray-200 bg-gray-25/50 p-6">
        <div className="text-center text-gray-500 mt-8">
          <p className="text-sm">No workspace found</p>
        </div>
      </aside>
    )
  }

  // Obtener datos reales de la base de datos
  const [quickStats, recentActivity] = await Promise.all([
    getQuickStatsFormatted(user.id, currentWorkspaceId),
    getRecentActivity(user.id, currentWorkspaceId, 3)
  ])

  return (
    <aside className="w-72 border-l h-full border-gray-200 bg-gray-25/50 p-6 overflow-y-auto">
      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Overview</h3>
        <div className="space-y-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                {stat.trendUp !== null && (
                  <div className="flex items-center">
                    {stat.trendUp ? (
                      <TrendingUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDownIcon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {stat.trend && (
                <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Recent Activity */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5 text-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {getActivityDescription(activity.type, activity.promptTitle)}
                    </p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500 text-center">No recent activity</p>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Quick Actions</h3>
        <div className="space-y-2">
          <Link 
            href="/new" 
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-card-hover transition-all duration-200 text-sm text-gray-700 hover:text-gray-900"
          >
            <PlusCircle className="h-4 w-4 text-neutral-600" />
            <span>Create new prompt</span>
          </Link>
          <Link 
            href="/search" 
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-card-hover transition-all duration-200 text-sm text-gray-700 hover:text-gray-900"
          >
            <span className="text-base">🔍</span>
            <span>Search prompts</span>
          </Link>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Quick Tip */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-gray-900">Tip</h3>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Keyboard shortcuts</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded">⌘ K</kbd> to quickly search your prompts
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
} 