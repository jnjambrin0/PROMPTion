import { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
  compact?: boolean
}

export function SettingsSection({ 
  title, 
  description, 
  children, 
  action,
  compact = false 
}: SettingsSectionProps) {
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className={`font-medium text-foreground ${compact ? 'text-base' : 'text-lg'}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
              {description}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {!compact && <Separator className="opacity-60" />}

      {/* Content */}
      <div className={compact ? "space-y-2" : "space-y-4"}>
        {children}
      </div>
    </div>
  )
} 