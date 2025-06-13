import { ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  description?: string
  value?: string | ReactNode
  action?: ReactNode
  compact?: boolean
  badge?: ReactNode
  disabled?: boolean
}

export function SettingsRow({ 
  label, 
  description, 
  value, 
  action, 
  compact = false,
  badge,
  disabled = false
}: SettingsRowProps) {
  return (
    <div className={`flex items-center justify-between py-2 ${
      disabled ? 'opacity-50' : 'hover:bg-muted/50 -mx-2 px-2 rounded-md transition-colors'
    }`}>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-foreground ${compact ? 'text-sm' : 'text-base'}`}>
            {label}
          </span>
          {badge}
        </div>
        
        {description && (
          <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
            {description}
          </p>
        )}
        
        {value && typeof value === 'string' && (
          <p className={`text-muted-foreground font-mono ${compact ? 'text-xs' : 'text-sm'}`}>
            {value}
          </p>
        )}
        
        {value && typeof value !== 'string' && value}
      </div>
      
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  )
} 