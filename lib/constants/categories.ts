// Colores disponibles para categorías - compatibles con el sistema ColorBadge
export const CATEGORY_COLORS = [
  { name: 'gray', value: 'gray', hex: '#6b7280' },
  { name: 'blue', value: 'blue', hex: '#3b82f6' },
  { name: 'green', value: 'green', hex: '#22c55e' },
  { name: 'yellow', value: 'yellow', hex: '#eab308' },
  { name: 'red', value: 'red', hex: '#ef4444' },
  { name: 'purple', value: 'purple', hex: '#a855f7' },
  { name: 'pink', value: 'pink', hex: '#ec4899' },
  { name: 'indigo', value: 'indigo', hex: '#6366f1' },
] as const

// Iconos monocromáticos estilo Notion
export const CATEGORY_ICONS = [
  '📁', '📋', '📝', '📊', '📈', '📉', '🗂️', '🗃️',
  '🔖', '🏷️', '📌', '📍', '🎯', '⭐', '✅', '❌',
  '⚡', '🔥', '💡', '🔧', '⚙️', '🛠️', '🔍', '🔎',
  '📤', '📥', '📦', '🗄️', '💼', '🎨', '🖼️', '📷'
] as const

export type CategoryColor = typeof CATEGORY_COLORS[number]['value']
export type CategoryIcon = typeof CATEGORY_ICONS[number] 