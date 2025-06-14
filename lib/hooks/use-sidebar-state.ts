import { useState, useCallback, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { SidebarState } from '@/lib/types/sidebar'

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface UseSidebarStateProps {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useSidebarState({ 
  defaultOpen = true, 
  onOpenChange 
}: UseSidebarStateProps = {}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)
  const [_open, _setOpen] = useState(defaultOpen)

  // Handle controlled vs uncontrolled state
  const open = onOpenChange ? defaultOpen : _open
  
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      
      if (onOpenChange) {
        onOpenChange(openState)
      } else {
        _setOpen(openState)
      }

      // Persist state in cookie
      if (typeof window !== 'undefined') {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      }
    },
    [onOpenChange, open]
  )

  // Toggle function for convenience
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile(prev => !prev) : setOpen(prev => !prev)
  }, [isMobile, setOpen, setOpenMobile])

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state: SidebarState = open ? "expanded" : "collapsed"

  return {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  }
} 