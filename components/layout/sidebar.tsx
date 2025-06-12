import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { QUICK_ACTIONS, WORKSPACE_NAVIGATION } from '@/lib/constants/navigation'

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-neutral-200 bg-neutral-50/30 p-4">
      {/* Brand */}
      <div className="mb-6">
        <Link href="/home" className="block">
          <h1 className="text-lg font-semibold text-neutral-900">Promption</h1>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="space-y-1">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.id}
              href={action.href!}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Workspace Navigation */}
      <div>
        <h3 className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
          Workspace
        </h3>
        <div className="space-y-1">
          {WORKSPACE_NAVIGATION.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
} 