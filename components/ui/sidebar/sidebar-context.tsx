'use client'

import { createContext, useContext, useMemo } from 'react'
import { useSidebarState } from '@/lib/hooks/use-sidebar-state'
import type { 
  SidebarContextProps, 
  SidebarProviderProps 
} from '@/lib/types/sidebar'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

const SidebarContext = createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps & React.ComponentProps<"div">) {
  const sidebarState = useSidebarState({
    defaultOpen,
    onOpenChange: setOpenProp
  })

  // Override with controlled prop if provided
  const contextValue = useMemo<SidebarContextProps>(() => ({
    ...sidebarState,
    open: openProp ?? sidebarState.open,
  }), [sidebarState, openProp])

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": "16rem",
              "--sidebar-width-icon": "3rem",
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
} 