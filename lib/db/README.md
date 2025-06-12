# Base de Datos - Funciones Seguras

Este módulo contiene funciones seguras y eficientes para interactuar con la base de datos. Todas las funciones incluyen validación de entrada, verificación de permisos y manejo robusto de errores.

## 🔒 Principios de Seguridad

- **Validación de entrada**: Todos los parámetros son validados
- **Control de acceso**: Verificación de permisos en cada operación
- **Prevención de inyección**: Uso exclusivo de Prisma ORM
- **Manejo de errores**: Sin exposición de información sensible

## 📖 Ejemplos de Uso

### Usuarios

```typescript
import { getUserById, updateUser } from '@/lib/db'

// ✅ Correcto - con validación
async function getUser(id: string) {
  try {
    const user = await getUserById(id)
    return user
  } catch (error) {
    throw new Error('Failed to fetch user')
  }
}

// ✅ Correcto - actualización segura
await updateUser(userId, {
  fullName: 'Nuevo Nombre',
  bio: 'Nueva biografía'
})
```

### Workspaces

```typescript
import { getWorkspaceById, hasWorkspaceAccess } from '@/lib/db'

// ✅ Verificación de acceso automática
const workspace = await getWorkspaceById(workspaceId, userId)

// ✅ Verificación explícita de permisos
if (await hasWorkspaceAccess(workspaceId, userId)) {
  // Usuario tiene acceso
}
```

### Prompts

```typescript
import { getWorkspacePrompts, createPrompt } from '@/lib/db'

// ✅ Listado con paginación y filtros seguros
const result = await getWorkspacePrompts(workspaceId, userId, {
  page: 1,
  limit: 20,
  search: 'búsqueda',
  isTemplate: false
})

// ✅ Creación con validación completa
const prompt = await createPrompt({
  title: 'Mi Prompt',
  slug: 'mi-prompt',
  description: 'Descripción',
  workspaceId,
  isPublic: false
}, userId)
```

## 🛡️ Validaciones Incluidas

- **UUID**: Formato válido de identificadores
- **Slug**: Formato correcto para URLs
- **Paginación**: Límites seguros automáticos
- **Texto**: Sanitización y límites de longitud
- **Permisos**: Verificación automática de acceso

## 📋 Respuestas Estándar

```typescript
import { createSuccessResponse, createErrorResponse } from '@/lib/db'

// Respuesta exitosa con paginación
return createSuccessResponse(data, {
  page: 1,
  limit: 20,
  total: 100,
  totalPages: 5
})

// Respuesta de error segura
return createErrorResponse('Error message')
```

## ⚠️ Qué NO hacer

- ❌ Consultas directas sin validación
- ❌ Exponer errores de base de datos
- ❌ Hardcodear usuarios o permisos
- ❌ Omitir validación de entrada

## 🔧 Características de Seguridad

- Control de acceso granular por entidad
- Validación exhaustiva de parámetros
- Soft delete para prompts
- Transacciones para operaciones complejas
- Límites automáticos de paginación
- Manejo seguro de errores 