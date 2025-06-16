import prisma from '@/lib/prisma'

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

/**
 * Validate if a prompt slug is available in a workspace
 */
export async function validatePromptSlug(
  slug: string, 
  workspaceId: string,
  excludePromptId?: string
): Promise<boolean> {
  try {
    // Basic validation
    if (!slug || !/^[a-z0-9-]+$/.test(slug) || slug.length < 3) {
      return false
    }

    if (!workspaceId || workspaceId.trim() === '') {
      return false
    }

    // Build where clause
    const whereClause: Record<string, unknown> = {
      slug: slug,
      workspaceId: workspaceId,
      deletedAt: null
    }

    // Exclude current prompt if editing
    if (excludePromptId) {
      whereClause.id = { not: excludePromptId }
    }

    // Check if slug is available in workspace
    const existing = await prisma.prompt.findFirst({
      where: whereClause,
      select: { id: true }
    })

    return !existing
  } catch (error) {
    console.error('Error validating prompt slug:', error)
    return false
  }
}

/**
 * Generate a unique slug for a prompt in a workspace
 */
export async function generateUniquePromptSlug(
  baseTitle: string,
  workspaceId: string,
  excludePromptId?: string
): Promise<string> {
  const baseSlug = generateSlugFromTitle(baseTitle)
  let finalSlug = baseSlug
  let counter = 1

  // Keep trying with incrementing numbers until we find a unique slug
  while (!(await validatePromptSlug(finalSlug, workspaceId, excludePromptId))) {
    finalSlug = `${baseSlug}-${counter}`
    counter++
    
    // Safety check to prevent infinite loops
    if (counter > 100) {
      finalSlug = `${baseSlug}-${Date.now()}`
      break
    }
  }

  return finalSlug
}

/**
 * Clean and validate category ID
 */
export function cleanCategoryId(categoryId?: string): string | undefined {
  return categoryId && 
         categoryId !== 'none' && 
         categoryId !== '' && 
         categoryId.trim() !== '' 
         ? categoryId.trim() 
         : undefined
} 