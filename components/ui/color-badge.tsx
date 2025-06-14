import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ColorBadgeProps {
  color: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// Mapeo de colores - actualizado para ser consistente con las constantes
const colorMap: Record<string, string> = {
  // Sistema principal de colores (debe coincidir con CATEGORY_COLORS)
  'gray': '#6b7280',
  'blue': '#3b82f6',
  'green': '#22c55e',
  'yellow': '#eab308',
  'red': '#ef4444',
  'purple': '#a855f7',
  'pink': '#ec4899',
  'indigo': '#6366f1',
  
  // Colores adicionales para compatibilidad
  'orange': '#f97316',
  'teal': '#14b8a6',
  'cyan': '#06b6d4',
  'lime': '#84cc16',
  'emerald': '#10b981',
  'rose': '#f43f5e',
  'violet': '#8b5cf6',
  'amber': '#f59e0b',
  'sky': '#0ea5e9',
  'slate': '#64748b',
  'zinc': '#71717a',
  'neutral': '#737373',
  'stone': '#78716c',
  
  // Colores en español
  'rojo': '#ef4444',
  'azul': '#3b82f6',
  'verde': '#22c55e',
  'amarillo': '#eab308',
  'morado': '#a855f7',
  'rosa': '#ec4899',
  'naranja': '#f97316',
  'gris': '#6b7280',
  'negro': '#000000',
  'blanco': '#ffffff',
  
  // Tonos específicos
  'crimson': '#dc143c',
  'navy': '#000080',
  'gold': '#ffd700',
  'silver': '#c0c0c0',
  'maroon': '#800000',
  'olive': '#808000',
  'coral': '#ff7f50',
  'salmon': '#fa8072',
  'khaki': '#f0e68c',
  'lavender': '#e6e6fa',
  'mint': '#98fb98',
  'peach': '#ffcba4'
}

function getColorValue(colorName: string): string {
  const normalizedColor = colorName.toLowerCase().trim()
  
  // Si es un color hexadecimal válido, devolverlo tal como está
  if (/^#[0-9A-F]{6}$/i.test(normalizedColor)) {
    return normalizedColor
  }
  
  // Si es un color RGB válido, devolverlo tal como está
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(normalizedColor)) {
    return normalizedColor
  }
  
  // Buscar en el mapeo de colores
  return colorMap[normalizedColor] || '#6b7280' // Default a gray
}

export function ColorBadge({ color, className, size = 'sm' }: ColorBadgeProps) {
  const colorValue = getColorValue(color)
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "inline-flex items-center gap-2 border-muted-foreground/20",
        className
      )}
    >
      <div 
        className={cn(
          "rounded-full border border-muted-foreground/30 flex-shrink-0",
          sizeClasses[size]
        )}
        style={{ backgroundColor: colorValue }}
        aria-label={`Color: ${color}`}
      />
      <span className="capitalize text-xs font-medium">{color}</span>
    </Badge>
  )
}

export default ColorBadge 