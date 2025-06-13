'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PromptViewSwitcherProps {
  currentView: string
  onViewChange?: (view: string) => void
}

export function PromptViewSwitcher({ currentView, onViewChange }: PromptViewSwitcherProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateView = (view: string) => {
    if (onViewChange) {
      // Use callback for instant local updates
      onViewChange(view)
    } else {
      // Fallback to URL updates
      const params = new URLSearchParams(searchParams.toString())
      params.set('view', view)
      router.push(`?${params.toString()}`)
    }
  }

  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => updateView('list')}
        className={`h-8 w-8 p-0 transition-colors ${
          currentView === 'list'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
        }`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => updateView('grid')}
        className={`h-8 w-8 p-0 transition-colors ${
          currentView === 'grid'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
        }`}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  )
} 