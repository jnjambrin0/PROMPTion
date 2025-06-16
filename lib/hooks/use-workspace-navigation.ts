'use client'

import { useCallback } from 'react'

type WorkspaceTab = 'overview' | 'prompts' | 'categories' | 'members' | 'settings'

interface UseWorkspaceNavigationProps {
  workspaceSlug: string
  onTabChange: (tab: WorkspaceTab) => void
}

export function useWorkspaceNavigation({ 
 
  onTabChange 
}: UseWorkspaceNavigationProps) {
  
  const navigateToTab = useCallback((
    tab: WorkspaceTab, 
    queryParams?: Record<string, string>
  ) => {
    // Cambiar tab inmediatamente
    onTabChange(tab)
    
    // Actualizar URL con parámetros adicionales
    const url = new URL(window.location.href)
    
    // Limpiar parámetros existentes relacionados con tabs
    url.searchParams.delete('tab')
    url.searchParams.delete('category')
    url.searchParams.delete('search')
    
    // Establecer el tab si no es overview
    if (tab !== 'overview') {
      url.searchParams.set('tab', tab)
    }
    
    // Añadir parámetros adicionales
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value)
        }
      })
    }
    
    // Actualizar URL sin refresh
    window.history.replaceState({ tab, ...queryParams }, '', url.toString())
  }, [onTabChange])

  const navigateToPrompts = useCallback((categoryId?: string) => {
    navigateToTab('prompts', categoryId ? { category: categoryId } : undefined)
  }, [navigateToTab])

  const navigateToCategories = useCallback(() => {
    navigateToTab('categories')
  }, [navigateToTab])

  const navigateToMembers = useCallback(() => {
    navigateToTab('members')
  }, [navigateToTab])

  const navigateToSettings = useCallback(() => {
    navigateToTab('settings')
  }, [navigateToTab])

  const navigateToOverview = useCallback(() => {
    navigateToTab('overview')
  }, [navigateToTab])

  // Función genérica para crear botones de navegación
  const createNavigationButton = useCallback((
    tab: WorkspaceTab, 
    queryParams?: Record<string, string>
  ) => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      navigateToTab(tab, queryParams)
    }
  }), [navigateToTab])

  return {
    navigateToTab,
    navigateToPrompts,
    navigateToCategories,
    navigateToMembers,
    navigateToSettings,
    navigateToOverview,
    createNavigationButton
  }
} 