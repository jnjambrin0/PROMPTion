import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface FieldGroupProps {
  title: string
  description?: string
  children: React.ReactNode
  isLast?: boolean
  isAdvanced?: boolean
  defaultExpanded?: boolean
}

export function FieldGroup({ 
  title, 
  description, 
  children, 
  isLast = false, 
  isAdvanced = false,
  defaultExpanded = false
}: FieldGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (isAdvanced) {
    return (
      <div className={`${!isLast ? 'border-b border-gray-100' : ''}`}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  Advanced
                </span>
              </div>
              {description && (
                <p className="text-sm text-gray-600 mt-1 ml-6">{description}</p>
              )}
            </div>
          </div>
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {children}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`p-6 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
} 