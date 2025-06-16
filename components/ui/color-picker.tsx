'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from './label'
import { Check } from 'lucide-react'

export type CategoryColor = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'indigo'

interface ColorOption {
  value: CategoryColor
  label: string
  bg: string
  border: string
  text: string
  hover: string
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    value: 'gray',
    label: 'Gray',
    bg: '#f9fafb',
    border: '#d1d5db',
    text: '#6b7280',
    hover: '#f3f4f6'
  },
  {
    value: 'blue',
    label: 'Blue',
    bg: '#f0f9ff',
    border: '#bae6fd',
    text: '#0284c7',
    hover: '#e0f2fe'
  },
  {
    value: 'green',
    label: 'Green',
    bg: '#f0fdf4',
    border: '#86efac',
    text: '#16a34a',
    hover: '#dcfce7'
  },
  {
    value: 'yellow',
    label: 'Yellow',
    bg: '#fffbeb',
    border: '#fcd34d',
    text: '#d97706',
    hover: '#fef3c7'
  },
  {
    value: 'red',
    label: 'Red',
    bg: '#fef2f2',
    border: '#fca5a5',
    text: '#dc2626',
    hover: '#fecaca'
  },
  {
    value: 'purple',
    label: 'Purple',
    bg: '#faf5ff',
    border: '#c084fc',
    text: '#9333ea',
    hover: '#e9d5ff'
  },
  {
    value: 'pink',
    label: 'Pink',
    bg: '#fdf2f8',
    border: '#e879f9',
    text: '#c026d3',
    hover: '#f3e8ff'
  },
  {
    value: 'indigo',
    label: 'Indigo',
    bg: '#f0f9ff',
    border: '#93c5fd',
    text: '#4f46e5',
    hover: '#e0f2fe'
  }
]

interface ColorPickerProps {
  value?: CategoryColor
  onChange: (color: CategoryColor) => void
  label?: string
}

export function ColorPicker({ 
  value = 'gray', 
  onChange, 
  label = 'Color' 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredColor, setHoveredColor] = useState<CategoryColor | null>(null)
  
  const selectedColor = COLOR_OPTIONS.find(color => color.value === value) || COLOR_OPTIONS[0]

  const handleColorSelect = (color: CategoryColor) => {
    onChange(color)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-full justify-start gap-2 px-2 transition-colors"
            style={{
              backgroundColor: selectedColor.bg,
              borderColor: selectedColor.border,
              color: selectedColor.text
            }}
            type="button"
          >
            <div 
              className="w-4 h-4 rounded-full border-2 flex-shrink-0"
              style={{
                backgroundColor: selectedColor.bg,
                borderColor: selectedColor.border
              }}
            />
            <span className="capitalize font-medium">{selectedColor.label}</span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Choose a color</h4>
            
            <div className="grid grid-cols-2 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  onMouseEnter={() => setHoveredColor(color.value)}
                  onMouseLeave={() => setHoveredColor(null)}
                  className="flex items-center gap-3 w-full p-2 rounded-md text-left transition-all border group relative"
                  style={{
                    backgroundColor: hoveredColor === color.value ? color.hover : color.bg,
                    borderColor: color.border,
                    color: color.text
                  }}
                  type="button"
                >
                  <div 
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                    style={{
                      backgroundColor: color.bg,
                      borderColor: color.border
                    }}
                  />
                  <span className="text-sm font-medium capitalize">{color.label}</span>
                  
                  {value === color.value && (
                    <Check 
                      className="w-4 h-4 ml-auto flex-shrink-0"
                      style={{ color: color.text }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Colors help organize and identify your collections
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Export color utilities for use in other components
export function getCategoryColorClasses(color: CategoryColor) {
  const colorOption = COLOR_OPTIONS.find(c => c.value === color) || COLOR_OPTIONS[0]
  return {
    bg: colorOption.bg,
    border: colorOption.border,
    text: colorOption.text,
    hover: colorOption.hover
  }
}

// Helper function to get inline styles for a color
export function getCategoryColorStyles(color: CategoryColor) {
  const colorOption = COLOR_OPTIONS.find(c => c.value === color) || COLOR_OPTIONS[0]
  return {
    backgroundColor: colorOption.bg,
    borderColor: colorOption.border,
    color: colorOption.text
  }
} 