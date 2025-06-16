'use client'

import React from 'react'
import { AlertTriangle, Construction, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DevelopmentNoticeProps {
  title?: string
  description?: string
  type?: 'development' | 'coming-soon' | 'maintenance'
  estimatedDate?: string
  className?: string
}

export function DevelopmentNotice({ 
  title = "Feature in Development",
  description = "This feature is currently being developed and will be available soon.",
  type = 'development',
  estimatedDate,
  className
}: DevelopmentNoticeProps) {
  const getConfig = () => {
    switch (type) {
      case 'coming-soon':
        return {
          icon: Clock,
          badge: 'Coming Soon',
          badgeVariant: 'secondary' as const,
          alertClass: 'border-blue-200 bg-blue-50/30 dark:bg-blue-950/20 dark:border-blue-800'
        }
      case 'maintenance':
        return {
          icon: AlertTriangle,
          badge: 'Maintenance',
          badgeVariant: 'destructive' as const,
          alertClass: 'border-orange-200 bg-orange-50/30 dark:bg-orange-950/20 dark:border-orange-800'
        }
      default: // development
        return {
          icon: Construction,
          badge: 'In Development',
          badgeVariant: 'outline' as const,
          alertClass: 'border-gray-200 bg-gray-50/30 dark:bg-gray-950/20 dark:border-gray-700'
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon

  return (
    <div className={cn("w-full", className)}>
      <Alert className={cn("border-l-4 w-full", config.alertClass)}>
        <div className="flex items-start gap-3 w-full">
          <Icon className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0 space-y-2 w-full">
            <div className="flex items-start justify-between gap-2 w-full">
              <AlertTitle className="text-sm font-medium text-foreground leading-5 flex-1">
                {title}
              </AlertTitle>
              <Badge variant={config.badgeVariant} className="text-xs shrink-0">
                {config.badge}
              </Badge>
            </div>
            <AlertDescription className="text-sm text-muted-foreground leading-relaxed w-full">
              {description}
              {estimatedDate && (
                <div className="mt-2 text-xs font-medium text-foreground">
                  <span className="text-muted-foreground">Estimated availability:</span> {estimatedDate}
                </div>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  )
}

// Predefined notices for common cases
export const INTEGRATIONS_NOTICE = {
  title: "Integrations Coming Soon",
  description: "We're working on powerful integrations with popular tools like Slack, GitHub, Notion, and more. Stay tuned for updates!",
  type: 'coming-soon' as const,
  estimatedDate: "Q2 2024"
}

export const API_NOTICE = {
  title: "API Access in Development", 
  description: "Our REST API is currently in development. You'll be able to integrate Promption with your own applications soon.",
  type: 'development' as const,
  estimatedDate: "Q1 2024"
}

export const ANALYTICS_NOTICE = {
  title: "Advanced Analytics Coming Soon",
  description: "Detailed usage analytics and insights are being developed to help you understand your prompt performance.",
  type: 'coming-soon' as const,
  estimatedDate: "Q3 2024"
} 