'use client'

import { useState } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { ENTITY_ICONS } from '@/lib/types/forms'
import { Label } from './label'

interface IconPickerProps {
  value?: string
  onChange: (icon: string) => void
  label?: string
  placeholder?: string
}

export function IconPicker({ 
  value, 
  onChange, 
  label = 'Icon',
  placeholder = '📝' 
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleIconSelect = (icon: string) => {
    onChange(icon)
    setIsOpen(false)
  }

  const displayIcon = value || placeholder

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-20 text-lg p-0 justify-center hover:bg-gray-50 transition-colors"
            type="button"
          >
            {displayIcon}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Choose an icon</h4>
            
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              {ENTITY_ICONS.map((icon, index) => (
                <button
                  key={`${icon}-${index}`}
                  onClick={() => handleIconSelect(icon)}
                  className={`h-8 w-8 rounded text-lg hover:bg-gray-100 transition-colors flex items-center justify-center ${
                    value === icon ? 'bg-gray-100 ring-2 ring-gray-300' : ''
                  }`}
                  type="button"
                  title={`Select ${icon} icon`}
                >
                  {icon}
                </button>
              ))}
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleIconSelect(placeholder)}
                className="text-sm text-gray-600 h-8"
                type="button"
              >
                Reset to default
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 