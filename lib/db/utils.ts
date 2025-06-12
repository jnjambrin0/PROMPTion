import prisma from '../prisma'

/**
 * Valida si un UUID es válido
 * @param id - String a validar
 * @returns true si es un UUID válido
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

/**
 * Valida parámetros de paginación
 * @param page - Número de página
 * @param limit - Elementos por página
 * @returns Parámetros validados
 */
export function validatePagination(page: number = 1, limit: number = 20) {
  if (page < 1) page = 1
  if (limit < 1) limit = 1
  if (limit > 100) limit = 100
  
  return {
    page,
    limit,
    skip: (page - 1) * limit
  }
}

/**
 * Valida un slug
 * @param slug - Slug a validar
 * @returns true si es válido
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 50
}

/**
 * Sanitiza entrada de texto
 * @param text - Texto a sanitizar
 * @param maxLength - Longitud máxima
 * @returns Texto sanitizado
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
  if (typeof text !== 'string') return ''
  return text.trim().slice(0, maxLength)
}

/**
 * Verifica si un usuario existe
 * @param userId - ID del usuario
 * @returns true si existe
 */
export async function userExists(userId: string): Promise<boolean> {
  if (!isValidUUID(userId)) return false
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    })
    return !!user
  } catch {
    return false
  }
}

/**
 * Verifica si un workspace existe y está activo
 * @param workspaceId - ID del workspace
 * @returns true si existe y está activo
 */
export async function workspaceExists(workspaceId: string): Promise<boolean> {
  if (!isValidUUID(workspaceId)) return false
  
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { 
        id: workspaceId,
        isActive: true 
      },
      select: { id: true }
    })
    return !!workspace
  } catch {
    return false
  }
}

/**
 * Genera un slug único basado en un título
 * @param title - Título base
 * @param workspaceId - ID del workspace (opcional, para verificar unicidad)
 * @returns Slug único
 */
export async function generateUniqueSlug(
  title: string, 
  workspaceId?: string
): Promise<string> {
  // Convertir título a slug
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 50)

  if (!baseSlug) {
    baseSlug = 'untitled'
  }

  // Si no hay workspace, devolver el slug base
  if (!workspaceId) {
    return baseSlug
  }

  // Verificar unicidad en el workspace
  let counter = 0
  let slug = baseSlug

  while (counter < 100) { // Límite de seguridad
    const existing = await prisma.prompt.findFirst({
      where: {
        slug,
        workspaceId,
        deletedAt: null
      },
      select: { id: true }
    })

    if (!existing) {
      return slug
    }

    counter++
    slug = `${baseSlug}-${counter}`
  }

  // Fallback con timestamp si no se encuentra slug único
  return `${baseSlug}-${Date.now()}`
}

/**
 * Formatea un error de base de datos de forma segura
 * @param error - Error de Prisma
 * @returns Mensaje de error seguro para el usuario
 */
export function formatDatabaseError(error: any): string {
  if (error?.code === 'P2002') {
    return 'A record with this information already exists'
  }
  
  if (error?.code === 'P2025') {
    return 'Record not found'
  }
  
  if (error?.code === 'P2003') {
    return 'Referenced record does not exist'
  }
  
  // No exponer detalles internos de la base de datos
  return 'A database error occurred'
}

/**
 * Estructura de respuesta estándar para APIs
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Crea una respuesta de éxito
 * @param data - Datos a devolver
 * @param pagination - Información de paginación opcional
 * @returns Respuesta estructurada
 */
export function createSuccessResponse<T>(
  data: T, 
  pagination?: ApiResponse<T>['pagination']
): ApiResponse<T> {
  return {
    success: true,
    data,
    pagination
  }
}

/**
 * Crea una respuesta de error
 * @param error - Mensaje de error
 * @returns Respuesta de error estructurada
 */
export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error
  }
} 