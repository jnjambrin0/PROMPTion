'use client'

import { forwardRef } from 'react'
import { PanelLeftIcon } from "lucide-react"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSidebar } from './sidebar-context'
import type { SidebarProps } from '@/lib/types/sidebar'

export const Sidebar = forwardRef<
  HTMLDivElement,
  SidebarProps & React.ComponentProps<"div">
>(({ 
  side = "left", 
  variant = "sidebar", 
  collapsible = "offcanvas", 
  className, 
  children, 
  ...props 
}, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        ref={ref}
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          ref={ref}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": "18rem",
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      ref={ref}
      data-sidebar="sidebar"
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      className={cn(
        "bg-sidebar text-sidebar-foreground group peer hidden md:block",
        "transition-[width] duration-200 ease-linear",
        "h-svh w-(--sidebar-width)",
        "[[data-state=collapsed][data-collapsible=offcanvas]_&]:w-0",
        "[[data-state=collapsed][data-collapsible=icon]_&]:w-(--sidebar-width-icon)",
        variant === "floating" &&
          "data-[collapsible=offcanvas]:border-sidebar-border rounded-lg border shadow-sm",
        variant === "inset" && 
          "inset-y-2 left-2 z-10 h-(calc(100vh-theme(spacing.4))) w-(calc(var(--sidebar-width)-theme(spacing.4))) rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Sidebar.displayName = "Sidebar"

export const SidebarTrigger = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger" 