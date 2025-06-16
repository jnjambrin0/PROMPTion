import { getUserByAuthId } from './users'
import { getUserWorkspaces } from './workspaces'
import { getWorkspacePrompts } from './prompts'

interface DashboardStats {
  totalWorkspaces: number
  totalPrompts: number
  totalTemplates: number
  totalPublic: number
}

interface DashboardData {
  user: Record<string, unknown>
  workspaces: Record<string, unknown>[]
  prompts: Record<string, unknown>[]
  stats: DashboardStats
}

/**
 * OPTIMIZED dashboard data fetching - eliminando funciones duplicadas
 */
export async function getDashboardData(userId: string): Promise<DashboardData | null> {
  try {
    // Step 1: Get user data
    const user = await getUserByAuthId(userId)
    if (!user) return null

    // Step 2: Get user workspaces
    const workspaces = await getUserWorkspaces(user.id)

    // Step 3: Fetch prompts con límite optimizado y campos reducidos
    const promptsPromises = workspaces.map(async (workspace) => {
      try {
        const { prompts } = await getWorkspacePrompts(workspace.id, user.id, {
          page: 1,
          limit: 25 // Reducido de 50 a 25 para mejor rendimiento
        })
        
        // Retornar solo campos esenciales para dashboard
        return prompts.map(prompt => ({
          id: prompt.id,
          title: prompt.title,
          slug: prompt.slug,
          description: prompt.description,
          isTemplate: prompt.isTemplate,
          isPublic: prompt.isPublic,
          updatedAt: prompt.updatedAt,
          createdAt: prompt.createdAt,
          _count: prompt._count || { blocks: 0 },
          user: prompt.user,
          workspace: {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug
          }
        }))
      } catch (error) {
        console.error(`Error fetching prompts for workspace ${workspace.id}:`, error)
        return []
      }
    })

    // Execute con mejor manejo de errores
    const promptsResults = await Promise.allSettled(promptsPromises)
    
    const allPrompts = promptsResults
      .filter((result): result is PromiseFulfilledResult<Record<string, unknown>[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value)

    // Sort optimizado - solo por updatedAt
    allPrompts.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    // Stats calculados de forma eficiente
    const stats: DashboardStats = {
      totalWorkspaces: workspaces.length,
      totalPrompts: allPrompts.length,
      totalTemplates: allPrompts.filter(p => p.isTemplate).length,
      totalPublic: allPrompts.filter(p => p.isPublic).length
    }

    return { 
      user, 
      workspaces, 
      prompts: allPrompts,
      stats
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}

/**
 * Parallel fetching version that maintains data consistency
 * while dramatically improving performance vs sequential fetching
 */
export async function getDashboardDataOptimized(userId: string): Promise<DashboardData | null> {
  try {
    const user = await getUserByAuthId(userId)
    if (!user) return null

    const workspaces = await getUserWorkspaces(user.id)

    // Use Promise.all for maximum parallelization with proper error handling
    const promptsPromises = workspaces.map(workspace => 
      getWorkspacePrompts(workspace.id, user.id, {
        page: 1,
        limit: 50
      }).then(({ prompts }) => 
        prompts.map(prompt => ({
          ...prompt,
          workspace: workspace
        }))
      ).catch(error => {
        console.error(`Failed to fetch prompts for workspace ${workspace.id}:`, error)
        return [] // Return empty array on error to continue with other workspaces
      })
    )

    // Execute all workspace queries in parallel
    const promptsArrays = await Promise.all(promptsPromises)
    const allPrompts = promptsArrays.flat()

    // Sort by updated date (most recent first)
    allPrompts.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    const stats: DashboardStats = {
      totalWorkspaces: workspaces.length,
      totalPrompts: allPrompts.length,
      totalTemplates: allPrompts.filter(p => p.isTemplate).length,
      totalPublic: allPrompts.filter(p => p.isPublic).length
    }

    return { 
      user, 
      workspaces, 
      prompts: allPrompts,
      stats
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
} 