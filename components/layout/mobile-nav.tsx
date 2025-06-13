'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { StatCard } from '@/components/ui/stat-card'
import { TopicItem } from '@/components/ui/topic-item'
import { QUICK_ACTIONS, WORKSPACE_NAVIGATION, MAIN_NAVIGATION } from '@/lib/constants/navigation'
import { 
  UPCOMING_ITEMS, 
  POPULAR_TOPICS, 
  QUICK_STATS, 
  TIPS 
} from '@/lib/constants/sidebar-data'

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className = '' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`md:hidden ${className}`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Navigate through your prompts and collections
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {/* Top section - Main Navigation */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Brand */}
                <div className="mb-6">
                  <Link href="/home" className="block" onClick={() => setIsOpen(false)}>
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
                        onClick={() => setIsOpen(false)}
                      >
                        <action.icon className="h-4 w-4" />
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Workspace Navigation */}
                <div className="mb-6">
                  <h3 className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Workspace
                  </h3>
                  <div className="space-y-1">
                    {WORKSPACE_NAVIGATION.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
                        onClick={() => setIsOpen(false)}
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

                <Separator className="mb-4" />

                {/* Main Navigation */}
                <div className="mb-6">
                  <h3 className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {MAIN_NAVIGATION.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Coming up - Mobile Version */}
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Coming up</h3>
                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    {UPCOMING_ITEMS.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-md bg-neutral-100 p-1.5">
                          <item.icon className="h-3 w-3 text-neutral-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                          <p className="text-xs text-neutral-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick stats - Mobile Version */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Quick stats</h3>
                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="space-y-3">
                      {QUICK_STATS.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
} 