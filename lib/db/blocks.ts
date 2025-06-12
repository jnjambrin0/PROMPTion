import prisma from '../prisma'
import type { Block, BlockType } from '../generated/prisma'

/**
 * Obtiene bloques de un prompt con verificación de acceso
 * @param promptId - ID del prompt
 * @param userId - ID del usuario
 * @returns Bloques ordenados por posición
 */
export async function getPromptBlocks(promptId: string, userId: string) {
  if (!promptId || !userId || typeof promptId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid prompt or user ID')
  }

  try {
    // Verificar acceso al prompt
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        deletedAt: null,
        OR: [
          { isPublic: true },
          { userId },
          {
            workspace: {
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: { userId }
                  }
                }
              ]
            }
          }
        ]
      },
      select: { id: true }
    })

    if (!prompt) {
      throw new Error('Prompt not found or access denied')
    }

    const blocks = await prisma.block.findMany({
      where: { promptId },
      select: {
        id: true,
        type: true,
        content: true,
        position: true,
        indentLevel: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      },
      orderBy: { position: 'asc' }
    })

    return blocks
  } catch (error) {
    console.error('Error fetching prompt blocks:', error)
    
    if (error instanceof Error && error.message.includes('access denied')) {
      throw error
    }
    
    throw new Error('Failed to fetch blocks')
  }
}

/**
 * Crea un nuevo bloque
 * @param data - Datos del bloque
 * @param userId - ID del usuario
 * @returns Bloque creado
 */
export async function createBlock(
  data: {
    promptId: string
    type: BlockType
    content: any
    position?: number
    parentId?: string
    indentLevel?: number
  },
  userId: string
) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  // Validaciones básicas
  if (!data.promptId || !data.type) {
    throw new Error('Prompt ID and block type are required')
  }

  if (data.indentLevel && (data.indentLevel < 0 || data.indentLevel > 10)) {
    throw new Error('Invalid indent level')
  }

  try {
    // Verificar permisos de edición al prompt
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: data.promptId,
        deletedAt: null,
        OR: [
          { userId },
          {
            workspace: {
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: {
                      userId,
                      role: { in: ['OWNER', 'ADMIN', 'EDITOR'] }
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      select: { id: true }
    })

    if (!prompt) {
      throw new Error('Prompt not found or no edit permissions')
    }

    // Si no se especifica posición, ponerlo al final
    let position = data.position
    if (position === undefined) {
      const lastBlock = await prisma.block.findFirst({
        where: { promptId: data.promptId },
        orderBy: { position: 'desc' },
        select: { position: true }
      })
      position = lastBlock ? lastBlock.position + 1 : 0
    }

    const block = await prisma.block.create({
      data: {
        promptId: data.promptId,
        userId,
        type: data.type,
        content: data.content || {},
        position,
        parentId: data.parentId,
        indentLevel: data.indentLevel || 0
      },
      select: {
        id: true,
        type: true,
        content: true,
        position: true,
        indentLevel: true,
        parentId: true,
        createdAt: true
      }
    })

    return block
  } catch (error) {
    console.error('Error creating block:', error)
    
    if (error instanceof Error && error.message.includes('permissions')) {
      throw error
    }
    
    throw new Error('Failed to create block')
  }
}

/**
 * Actualiza un bloque
 * @param id - ID del bloque
 * @param data - Datos a actualizar
 * @param userId - ID del usuario
 * @returns Bloque actualizado
 */
export async function updateBlock(
  id: string,
  data: {
    type?: BlockType
    content?: any
    position?: number
    indentLevel?: number
  },
  userId: string
) {
  if (!id || !userId || typeof id !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid block or user ID')
  }

  // Validaciones
  if (data.indentLevel && (data.indentLevel < 0 || data.indentLevel > 10)) {
    throw new Error('Invalid indent level')
  }

  if (data.position && data.position < 0) {
    throw new Error('Invalid position')
  }

  try {
    // Verificar permisos
    const block = await prisma.block.findFirst({
      where: {
        id,
        prompt: {
          deletedAt: null,
          OR: [
            { userId },
            {
              workspace: {
                OR: [
                  { ownerId: userId },
                  {
                    members: {
                      some: {
                        userId,
                        role: { in: ['OWNER', 'ADMIN', 'EDITOR'] }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      select: { id: true }
    })

    if (!block) {
      throw new Error('Block not found or no edit permissions')
    }

    const updatedBlock = await prisma.block.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      select: {
        id: true,
        type: true,
        content: true,
        position: true,
        indentLevel: true,
        updatedAt: true
      }
    })

    return updatedBlock
  } catch (error) {
    console.error('Error updating block:', error)
    
    if (error instanceof Error && error.message.includes('permissions')) {
      throw error
    }
    
    throw new Error('Failed to update block')
  }
}

/**
 * Elimina un bloque
 * @param id - ID del bloque
 * @param userId - ID del usuario
 */
export async function deleteBlock(id: string, userId: string): Promise<void> {
  if (!id || !userId || typeof id !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid block or user ID')
  }

  try {
    // Verificar permisos
    const block = await prisma.block.findFirst({
      where: {
        id,
        prompt: {
          deletedAt: null,
          OR: [
            { userId },
            {
              workspace: {
                OR: [
                  { ownerId: userId },
                  {
                    members: {
                      some: {
                        userId,
                        role: { in: ['OWNER', 'ADMIN', 'EDITOR'] }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      select: { id: true, promptId: true }
    })

    if (!block) {
      throw new Error('Block not found or no delete permissions')
    }

    // Eliminar en transacción para actualizar posiciones
    await prisma.$transaction(async (tx) => {
      // Eliminar el bloque
      await tx.block.delete({
        where: { id }
      })

      // Actualizar posiciones de bloques siguientes
      await tx.block.updateMany({
        where: {
          promptId: block.promptId,
          position: { gt: 0 }
        },
        data: {
          position: { decrement: 1 }
        }
      })
    })
  } catch (error) {
    console.error('Error deleting block:', error)
    
    if (error instanceof Error && error.message.includes('permissions')) {
      throw error
    }
    
    throw new Error('Failed to delete block')
  }
}

/**
 * Reordena bloques de un prompt
 * @param promptId - ID del prompt
 * @param blockUpdates - Array de { id, position }
 * @param userId - ID del usuario
 */
export async function reorderBlocks(
  promptId: string,
  blockUpdates: { id: string; position: number }[],
  userId: string
): Promise<void> {
  if (!promptId || !userId || typeof promptId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid prompt or user ID')
  }

  if (!Array.isArray(blockUpdates) || blockUpdates.length === 0) {
    throw new Error('Invalid block updates')
  }

  // Validar posiciones
  const positions = blockUpdates.map(u => u.position)
  if (positions.some(p => p < 0) || new Set(positions).size !== positions.length) {
    throw new Error('Invalid positions in block updates')
  }

  try {
    // Verificar permisos
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        deletedAt: null,
        OR: [
          { userId },
          {
            workspace: {
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: {
                      userId,
                      role: { in: ['OWNER', 'ADMIN', 'EDITOR'] }
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      select: { id: true }
    })

    if (!prompt) {
      throw new Error('Prompt not found or no edit permissions')
    }

    // Actualizar posiciones en transacción
    await prisma.$transaction(
      blockUpdates.map(update =>
        prisma.block.update({
          where: { id: update.id },
          data: { position: update.position }
        })
      )
    )
  } catch (error) {
    console.error('Error reordering blocks:', error)
    
    if (error instanceof Error && error.message.includes('permissions')) {
      throw error
    }
    
    throw new Error('Failed to reorder blocks')
  }
} 