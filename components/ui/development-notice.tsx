'use client'

import React from 'react'
import { AlertTriangle, Construction, Code, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

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
  className = ""
}: DevelopmentNoticeProps) {
  const getConfig = () => {
    switch (type) {
      case 'coming-soon':
        return {
          icon: Clock,
          badge: 'Coming Soon',
          badgeVariant: 'secondary' as const,
          alertClass: 'border-blue-200 bg-blue-50/50'
        }
      case 'maintenance':
        return {
          icon: AlertTriangle,
          badge: 'Maintenance',
          badgeVariant: 'destructive' as const,
          alertClass: 'border-orange-200 bg-orange-50/50'
        }
      default: // development
        return {
          icon: Construction,
          badge: 'In Development',
          badgeVariant: 'outline' as const,
          alertClass: 'border-gray-200 bg-gray-50/50'
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon

  return (
    <Alert className={`${config.alertClass} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTitle className="text-sm font-medium">{title}</AlertTitle>
            <Badge variant={config.badgeVariant} className="text-xs">
              {config.badge}
            </Badge>
          </div>
          <AlertDescription className="text-sm text-muted-foreground">
            {description}
            {estimatedDate && (
              <span className="block mt-1 text-xs">
                <strong>Estimated availability:</strong> {estimatedDate}
              </span>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}

// Predefined notices for common cases
export const INTEGRATIONS_NOTICE = {
  title: "Integrations Coming Soon",
  description: "We're working on powerful integrations with popular tools like Slack, GitHub, and more. Stay tuned for updates!",
  type: 'development' as const,
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
  estimatedDate: "Q2 2024"
} 